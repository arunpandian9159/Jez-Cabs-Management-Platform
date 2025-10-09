import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Checklist, ChecklistDocument } from '../schemas/checklist.schema';
import { ChecklistTemplate, ChecklistTemplateDocument } from '../schemas/checklist-template.schema';
import { Cab } from '../../cab/entities/cab.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { User } from '../../iam/entities';
import { CreateChecklistDto, UpdateChecklistDto, FilterChecklistDto, CreateTemplateDto } from '../dto';
import { CabStatus, BookingStatus } from '../../../common/enums';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectModel(Checklist.name)
    private readonly checklistModel: Model<ChecklistDocument>,
    @InjectModel(ChecklistTemplate.name)
    private readonly templateModel: Model<ChecklistTemplateDocument>,
    @InjectRepository(Cab)
    private readonly cabRepository: Repository<Cab>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createChecklistDto: CreateChecklistDto, currentUser: User): Promise<Checklist> {
    const { bookingId, cabId, ...checklistData } = createChecklistDto;

    // Validate booking exists and belongs to company
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, companyId: currentUser.companyId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Validate cab exists and belongs to company
    const cab = await this.cabRepository.findOne({
      where: { id: cabId, companyId: currentUser.companyId },
    });

    if (!cab) {
      throw new NotFoundException('Cab not found');
    }

    // Create checklist
    const checklist = new this.checklistModel({
      ...checklistData,
      bookingId,
      cabId,
      companyId: currentUser.companyId,
      completedBy: currentUser.id,
      completedAt: new Date(),
      isComplete: true,
      isApproved: false,
    });

    const savedChecklist = await checklist.save();

    // Emit event
    this.eventEmitter.emit('checklist.created', {
      checklistId: (savedChecklist._id as any).toString(),
      companyId: savedChecklist.companyId,
      bookingId: savedChecklist.bookingId,
      cabId: savedChecklist.cabId,
    });

    return savedChecklist;
  }

  async findAll(filterDto: FilterChecklistDto, currentUser: User) {
    const {
      bookingId,
      cabId,
      templateName,
      isComplete,
      isApproved,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filterDto;

    const filter: any = { companyId: currentUser.companyId };

    if (bookingId) filter.bookingId = bookingId;
    if (cabId) filter.cabId = cabId;
    if (templateName) filter.templateName = templateName;
    if (isComplete !== undefined) filter.isComplete = isComplete;
    if (isApproved !== undefined) filter.isApproved = isApproved;

    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'ASC' ? 1 : -1;

    const [checklists, total] = await Promise.all([
      this.checklistModel.find(filter).sort(sortOptions).skip(skip).limit(limit).exec(),
      this.checklistModel.countDocuments(filter).exec(),
    ]);

    return {
      data: checklists,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: User): Promise<ChecklistDocument> {
    const checklist = await this.checklistModel
      .findOne({ _id: id, companyId: currentUser.companyId })
      .exec();

    if (!checklist) {
      throw new NotFoundException('Checklist not found');
    }

    return checklist;
  }

  async update(id: string, updateChecklistDto: UpdateChecklistDto, currentUser: User): Promise<ChecklistDocument> {
    const checklist = await this.findOne(id, currentUser);

    // If checklist is already approved, don't allow updates
    if (checklist.isApproved) {
      throw new BadRequestException('Cannot update an approved checklist');
    }

    Object.assign(checklist, updateChecklistDto);
    const updatedChecklist = await checklist.save();

    // Emit event
    this.eventEmitter.emit('checklist.updated', {
      checklistId: (updatedChecklist._id as any).toString(),
      companyId: updatedChecklist.companyId,
      changes: updateChecklistDto,
    });

    return updatedChecklist;
  }

  async approve(id: string, currentUser: User): Promise<ChecklistDocument> {
    const checklist = await this.findOne(id, currentUser);

    if (!checklist.isComplete) {
      throw new BadRequestException('Cannot approve an incomplete checklist');
    }

    if (checklist.isApproved) {
      throw new BadRequestException('Checklist is already approved');
    }

    checklist.isApproved = true;
    checklist.approvedBy = currentUser.id;
    checklist.approvedAt = new Date();

    const approvedChecklist = await checklist.save();

    // Update cab status to AVAILABLE if this is a return checklist
    if (checklist.templateName.toLowerCase().includes('return') || 
        checklist.templateName.toLowerCase().includes('post-rental')) {
      const cab = await this.cabRepository.findOne({ where: { id: checklist.cabId } });
      if (cab && cab.status === CabStatus.RENTED) {
        // Check if booking is completed
        const booking = await this.bookingRepository.findOne({ where: { id: checklist.bookingId } });
        if (booking && booking.status === BookingStatus.COMPLETED) {
          cab.status = CabStatus.AVAILABLE;
          await this.cabRepository.save(cab);
        }
      }
    }

    // Emit event
    this.eventEmitter.emit('checklist.approved', {
      checklistId: (approvedChecklist._id as any).toString(),
      companyId: approvedChecklist.companyId,
      bookingId: approvedChecklist.bookingId,
      cabId: approvedChecklist.cabId,
      approvedBy: currentUser.id,
    });

    return approvedChecklist;
  }

  async reject(id: string, reason: string, currentUser: User): Promise<ChecklistDocument> {
    const checklist = await this.findOne(id, currentUser);

    if (checklist.isApproved) {
      throw new BadRequestException('Cannot reject an approved checklist');
    }

    checklist.isApproved = false;
    checklist.notes = `${checklist.notes || ''}\n\nRejection Reason: ${reason}`;

    const rejectedChecklist = await checklist.save();

    // Emit event
    this.eventEmitter.emit('checklist.rejected', {
      checklistId: (rejectedChecklist._id as any).toString(),
      companyId: rejectedChecklist.companyId,
      reason,
    });

    return rejectedChecklist;
  }

  async remove(id: string, currentUser: User): Promise<{ message: string }> {
    const checklist = await this.findOne(id, currentUser);

    if (checklist.isApproved) {
      throw new BadRequestException('Cannot delete an approved checklist');
    }

    await this.checklistModel.deleteOne({ _id: id }).exec();

    // Emit event
    this.eventEmitter.emit('checklist.deleted', {
      checklistId: id,
      companyId: currentUser.companyId,
    });

    return { message: 'Checklist deleted successfully' };
  }

  async getStatistics(currentUser: User) {
    const total = await this.checklistModel.countDocuments({ companyId: currentUser.companyId }).exec();
    const completed = await this.checklistModel.countDocuments({ companyId: currentUser.companyId, isComplete: true }).exec();
    const approved = await this.checklistModel.countDocuments({ companyId: currentUser.companyId, isApproved: true }).exec();
    const pending = await this.checklistModel.countDocuments({ companyId: currentUser.companyId, isComplete: true, isApproved: false }).exec();

    return {
      total,
      completed,
      approved,
      pending,
    };
  }

  // Template Management
  async createTemplate(createTemplateDto: CreateTemplateDto, currentUser: User): Promise<ChecklistTemplate> {
    const template = new this.templateModel({
      ...createTemplateDto,
      companyId: currentUser.companyId,
    });

    return template.save();
  }

  async findAllTemplates(currentUser: User): Promise<ChecklistTemplate[]> {
    return this.templateModel.find({ companyId: currentUser.companyId }).exec();
  }

  async findOneTemplate(id: string, currentUser: User): Promise<ChecklistTemplate> {
    const template = await this.templateModel
      .findOne({ _id: id, companyId: currentUser.companyId })
      .exec();

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async removeTemplate(id: string, currentUser: User): Promise<{ message: string }> {
    await this.findOneTemplate(id, currentUser);
    await this.templateModel.deleteOne({ _id: id }).exec();

    return { message: 'Template deleted successfully' };
  }
}


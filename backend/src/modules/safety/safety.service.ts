import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmergencyContact } from './entities/emergency-contact.entity';

@Injectable()
export class SafetyService {
  constructor(
    @InjectRepository(EmergencyContact)
    private contactRepository: Repository<EmergencyContact>,
  ) {}

  async findAllByUser(userId: string): Promise<EmergencyContact[]> {
    return this.contactRepository.find({
      where: { user_id: userId },
      order: { is_primary: 'DESC', created_at: 'ASC' },
    });
  }

  async create(data: Partial<EmergencyContact>): Promise<EmergencyContact> {
    const contact = this.contactRepository.create(data);
    return this.contactRepository.save(contact);
  }

  async update(
    id: string,
    data: Partial<EmergencyContact>,
  ): Promise<EmergencyContact> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }
    Object.assign(contact, data);
    return this.contactRepository.save(contact);
  }

  async delete(id: string): Promise<void> {
    await this.contactRepository.delete(id);
  }

  async setPrimary(id: string, userId: string): Promise<EmergencyContact> {
    // Remove primary from all contacts
    await this.contactRepository.update(
      { user_id: userId },
      { is_primary: false },
    );
    // Set new primary
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }
    contact.is_primary = true;
    return this.contactRepository.save(contact);
  }
}

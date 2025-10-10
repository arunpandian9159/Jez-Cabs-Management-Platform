import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities';
import { CreateUserDto } from '../dto';
import { UserRole } from '../../../common/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto, currentUser: User) {
    // Check if user email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Only OWNER and MANAGER can create users
    if (currentUser.role === UserRole.STAFF) {
      throw new ForbiddenException('You do not have permission to create users');
    }

    // MANAGER cannot create OWNER
    if (currentUser.role === UserRole.MANAGER && createUserDto.role === UserRole.OWNER) {
      throw new ForbiddenException('You cannot create an owner account');
    }

    // Hash password
    const bcryptRounds = parseInt(this.configService.get('BCRYPT_ROUNDS', '12'), 10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, bcryptRounds);

    // Create user
    const user = this.userRepository.create({
      company_id: currentUser.company_id,
      email: createUserDto.email,
      password_hash: hashedPassword,
      role: createUserDto.role,
      first_name: createUserDto.firstName,
      last_name: createUserDto.lastName,
      phone_number: createUserDto.phoneNumber,
      is_active: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = savedUser;

    return userWithoutPassword as User;
  }

  async findAll(currentUser: User) {
    const users = await this.userRepository.find({
      where: { company_id: currentUser.company_id },
      order: { created_at: 'DESC' },
    });

    // Remove password hashes from response
    return users.map((user) => {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async findOne(id: string, currentUser: User) {
    const user = await this.userRepository.findOne({
      where: { id, company_id: currentUser.company_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id: string, updateData: Partial<User>, currentUser: User) {
    const user = await this.userRepository.findOne({
      where: { id, company_id: currentUser.company_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only OWNER can update roles
    if (updateData.role && currentUser.role !== UserRole.OWNER) {
      throw new ForbiddenException('Only owners can update user roles');
    }

    // Update user
    Object.assign(user, updateData);
    const updatedUser = await this.userRepository.save(user);

    const { password_hash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deactivateUser(id: string, currentUser: User) {
    const user = await this.userRepository.findOne({
      where: { id, company_id: currentUser.company_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cannot deactivate yourself
    if (user.id === currentUser.id) {
      throw new ForbiddenException('You cannot deactivate your own account');
    }

    // Only OWNER and MANAGER can deactivate users
    if (currentUser.role === UserRole.STAFF) {
      throw new ForbiddenException('You do not have permission to deactivate users');
    }

    user.is_active = false;
    await this.userRepository.save(user);

    return { message: 'User deactivated successfully' };
  }
}


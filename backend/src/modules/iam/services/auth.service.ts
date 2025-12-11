import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../entities/user.entity';
import { UserRole } from '../../../common/enums';

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async register(registerDto: RegisterDto) {
    // Check if user email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const bcryptRounds = parseInt(this.configService.get('BCRYPT_ROUNDS', '12'), 10);
    const password_hash = await bcrypt.hash(registerDto.password, bcryptRounds);

    // Create user
    const user = this.userRepository.create({
      email: registerDto.email,
      password_hash,
      first_name: registerDto.firstName,
      last_name: registerDto.lastName,
      phone: registerDto.phone,
      role: registerDto.role || UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      is_verified: false,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = await this.generateToken(savedUser);

    return {
      message: 'Registration successful',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.first_name,
        lastName: savedUser.last_name,
        phone: savedUser.phone,
        role: savedUser.role,
        isVerified: savedUser.is_verified,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User account is not active');
    }

    // Verify password
    if (!user.password_hash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = await this.generateToken(user);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        isVerified: user.is_verified,
      },
      token,
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, status: UserStatus.ACTIVE },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

  async getMe(userId: string) {
    const user = await this.validateUser(userId);
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      isVerified: user.is_verified,
      avatar: user.avatar_url,
    };
  }

  private async generateToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}

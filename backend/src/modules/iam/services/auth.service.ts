import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, Company } from '../entities';
import { RegisterCompanyDto, LoginDto } from '../dto';
import { UserRole } from '../../../common/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerCompany(registerDto: RegisterCompanyDto) {
    // Check if company email already exists
    const existingCompany = await this.companyRepository.findOne({
      where: { contact_email: registerDto.companyEmail },
    });

    if (existingCompany) {
      throw new ConflictException('Company with this email already exists');
    }

    // Check if user email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create company
    const company = this.companyRepository.create({
      name: registerDto.companyName,
      address: registerDto.companyAddress,
      contact_email: registerDto.companyEmail,
      contact_phone: registerDto.companyPhone,
      subscription_tier: 'BASIC',
      is_active: true,
    });

    const savedCompany = await this.companyRepository.save(company);

    // Hash password
    const bcryptRounds = parseInt(this.configService.get('BCRYPT_ROUNDS', '12'), 10);
    const password_hash = await bcrypt.hash(registerDto.password, bcryptRounds);

    // Create owner user
    const user = this.userRepository.create({
      company_id: savedCompany.id,
      email: registerDto.email,
      password_hash,
      role: UserRole.OWNER,
      first_name: registerDto.firstName,
      last_name: registerDto.lastName,
      phone_number: registerDto.phoneNumber,
      is_active: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = await this.generateToken(savedUser);

    return {
      message: 'Company registered successfully',
      company: {
        id: savedCompany.id,
        name: savedCompany.name,
        email: savedCompany.contact_email,
      },
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.first_name,
        lastName: savedUser.last_name,
        role: savedUser.role,
      },
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['company'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Check if company is active
    if (!user.company.is_active) {
      throw new UnauthorizedException('Company account is inactive');
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
        role: user.role,
        companyId: user.company_id,
        companyName: user.company.name,
      },
      access_token: token,
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, is_active: true },
      relations: ['company'],
    });

    if (!user || !user.company.is_active) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

  private async generateToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      companyId: user.company_id,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}

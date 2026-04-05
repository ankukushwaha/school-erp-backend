import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { LoginRequestDto, LoginResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UsersRepository) {}

  async login(dto: LoginRequestDto, ipAddress: string): Promise<LoginResponseDto> {
    const user = await this.userRepository.getByEmailAsync(dto.email);

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await bcrypt.compare(dto.password || '', user.userPassword);
    
    if (!isValid) {
      await this.userRepository.updateLoginFailAsync(user.userId);
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.userRepository.updateLoginSuccessAsync(user.userId, ipAddress);

    // Simple pseudo-token for now. In a full implementation, integrate @nestjs/jwt
    const token = crypto.randomUUID();

    return {
      userId: user.userId,
      userName: user.userName,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    };
  }
}

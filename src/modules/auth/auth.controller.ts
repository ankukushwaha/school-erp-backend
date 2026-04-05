import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginRequestDto, @Req() req: any) {
    const ip = req.ip || 'NA';
    return this.service.login(dto, ip);
  }
}

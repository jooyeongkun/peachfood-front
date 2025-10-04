import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OTPService } from './services/otp.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private otpService: OTPService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.phone, body.password, body.address, body.latitude, body.longitude);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.phone, body.password);
  }

  @Post('send-otp')
  async sendOTP(@Body() body: SendOtpDto) {
    return this.otpService.sendOTP(body.phone);
  }

  @Post('verify-otp')
  async verifyOTP(@Body() body: VerifyOtpDto) {
    return this.otpService.verifyOTP(body.phone, body.code);
  }
}

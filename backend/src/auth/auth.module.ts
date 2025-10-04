import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { OTPService } from './services/otp.service';
import { MockSMSService } from './services/sms.service';
import { MockEmailService } from './services/email.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, OTPService, MockSMSService, MockEmailService],
  controllers: [AuthController],
})
export class AuthModule {}

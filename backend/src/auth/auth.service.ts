import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(phone: string, password: string, address: string, latitude?: number, longitude?: number) {
    const existingUser = await this.usersService.findByPhone(phone);
    if (existingUser) {
      throw new UnauthorizedException('이미 존재하는 전화번호입니다');
    }

    const user = await this.usersService.create(phone, password, address, latitude, longitude);
    const payload = { sub: user.id, phone: user.phone };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        address: user.address,
      },
    };
  }

  async login(phone: string, password: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      throw new UnauthorizedException('전화번호 또는 비밀번호가 잘못되었습니다');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('전화번호 또는 비밀번호가 잘못되었습니다');
    }

    const payload = { sub: user.id, phone: user.phone };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        address: user.address,
      },
    };
  }
}

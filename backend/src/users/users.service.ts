import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(phone: string, password: string, address: string, latitude?: number, longitude?: number): Promise<User> {
    console.log(`[회원가입] 전화번호: ${phone}, 주소: ${address}, 위도: ${latitude}, 경도: ${longitude}`);

    const hashedPassword = await bcrypt.hash(password, 10);
    const randomNum = Math.floor(Math.random() * 10000);
    const nickname = `user${randomNum}`;

    const user = this.usersRepository.create({
      phone,
      password: hashedPassword,
      nickname,
      address,
      latitude,
      longitude,
    });

    const savedUser = await this.usersRepository.save(user);
    console.log(`[회원가입 완료] ID: ${savedUser.id}, 위도: ${savedUser.latitude}, 경도: ${savedUser.longitude}`);

    return savedUser;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateAddress(userId: number, address: string, latitude?: number, longitude?: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.address = address;
    if (latitude !== undefined) {
      user.latitude = latitude;
    }
    if (longitude !== undefined) {
      user.longitude = longitude;
    }

    return this.usersRepository.save(user);
  }
}

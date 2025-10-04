import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menusRepository: Repository<Menu>,
  ) {}

  async create(restaurantId: number, data: Partial<Menu>): Promise<Menu> {
    const menu = this.menusRepository.create({
      ...data,
      restaurant_id: restaurantId,
    });
    return this.menusRepository.save(menu);
  }

  async findByRestaurantId(restaurantId: number): Promise<Menu[]> {
    return this.menusRepository.find({
      where: { restaurant_id: restaurantId, is_available: true }
    });
  }

  async findById(id: number): Promise<Menu | null> {
    return this.menusRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Menu>): Promise<Menu | null> {
    await this.menusRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.menusRepository.delete(id);
  }
}

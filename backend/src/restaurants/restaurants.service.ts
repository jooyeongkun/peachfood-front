import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantsRepository: Repository<Restaurant>,
  ) {}

  async create(ownerId: number, data: Partial<Restaurant>): Promise<Restaurant> {
    const restaurant = this.restaurantsRepository.create({
      ...data,
      owner_id: ownerId,
    });
    return this.restaurantsRepository.save(restaurant);
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantsRepository.find({ relations: ['owner'] });
  }

  async findById(id: number): Promise<Restaurant | null> {
    return this.restaurantsRepository.findOne({
      where: { id },
      relations: ['owner']
    });
  }

  async findByOwnerId(ownerId: number): Promise<Restaurant[]> {
    return this.restaurantsRepository.find({ where: { owner_id: ownerId } });
  }

  async update(id: number, data: Partial<Restaurant>): Promise<Restaurant | null> {
    await this.restaurantsRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.restaurantsRepository.delete(id);
  }
}

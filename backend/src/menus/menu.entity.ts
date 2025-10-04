import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  restaurant_id: number;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ length: 255 })
  name: string;

  @Column()
  price: number;

  @Column({ default: true })
  is_available: boolean;

  @CreateDateColumn()
  created_at: Date;
}

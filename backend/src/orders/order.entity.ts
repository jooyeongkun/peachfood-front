import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  customer_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ nullable: true })
  restaurant_id: number;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ length: 20, default: 'pending' })
  status: string;

  @Column()
  total_price: number;

  @Column('text')
  delivery_address: string;

  @Column({ length: 20 })
  delivery_phone: string;

  @CreateDateColumn()
  created_at: Date;
}

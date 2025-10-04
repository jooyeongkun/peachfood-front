import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity('chat_rooms')
export class ChatRoom {
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

  @CreateDateColumn()
  created_at: Date;
}

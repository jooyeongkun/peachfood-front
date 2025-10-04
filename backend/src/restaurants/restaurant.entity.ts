import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 50, nullable: true })
  category: string;

  @Column('text')
  address: string;

  @Column({ length: 20 })
  phone: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ default: 0 })
  min_order_amount: number;

  @Column({ default: 0 })
  delivery_fee: number;

  @Column({ default: true })
  is_open: boolean;

  @CreateDateColumn()
  created_at: Date;
}

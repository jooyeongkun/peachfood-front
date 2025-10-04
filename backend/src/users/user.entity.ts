import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column()
  password: string;

  @Column({ length: 50 })
  nickname: string;

  @Column('text')
  address: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  @CreateDateColumn()
  created_at: Date;
}

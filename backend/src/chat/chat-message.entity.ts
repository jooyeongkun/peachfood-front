import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { User } from '../users/user.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chat_room_id: number;

  @ManyToOne(() => ChatRoom)
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRoom;

  @Column({ nullable: true })
  sender_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column('text')
  message: string;

  @CreateDateColumn()
  created_at: Date;
}

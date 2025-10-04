import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat/chat.gateway';
import { ChatRoom } from './chat-room.entity';
import { ChatMessage } from './chat-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, ChatMessage])],
  providers: [ChatGateway],
})
export class ChatModule {}

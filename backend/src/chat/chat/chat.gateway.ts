import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from '../chat-room.entity';
import { ChatMessage } from '../chat-message.entity';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomsRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private chatMessagesRepository: Repository<ChatMessage>,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, payload: { roomId: number }) {
    client.join(`room_${payload.roomId}`);
    return { event: 'joinedRoom', data: payload.roomId };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: { roomId: number; senderId: number; message: string }) {
    const chatMessage = this.chatMessagesRepository.create({
      chat_room_id: payload.roomId,
      sender_id: payload.senderId,
      message: payload.message,
    });

    const savedMessage = await this.chatMessagesRepository.save(chatMessage);

    this.server.to(`room_${payload.roomId}`).emit('newMessage', {
      id: savedMessage.id,
      senderId: payload.senderId,
      message: payload.message,
      createdAt: savedMessage.created_at,
    });

    return { event: 'messageSent', data: savedMessage };
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(client: Socket, payload: { roomId: number }) {
    const messages = await this.chatMessagesRepository.find({
      where: { chat_room_id: payload.roomId },
      order: { created_at: 'ASC' },
    });

    return { event: 'messages', data: messages };
  }
}

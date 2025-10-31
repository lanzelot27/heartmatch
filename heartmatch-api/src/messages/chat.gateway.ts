import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://172.27.64.1:3000'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() data: { matchId: string }, @ConnectedSocket() client: Socket) {
    const room = `match-${data.matchId}`;
    client.join(room);
    console.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@MessageBody() data: { matchId: string }, @ConnectedSocket() client: Socket) {
    const room = `match-${data.matchId}`;
    client.leave(room);
    console.log(`Client ${client.id} left room: ${room}`);
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @MessageBody() data: { matchId: string; senderId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Save message to database
      const message = await this.messagesService.create(data);
      
      // Broadcast to all clients in the match room
      const room = `match-${data.matchId}`;
      this.server.to(room).emit('new-message', message);
      
      return message;
    } catch (error) {
      client.emit('error', { message: 'Failed to send message' });
    }
  }
}


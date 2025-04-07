// src/websockets/websockets.gateway.ts
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { ChatsService } from 'src/chats/providers/chats.service';
import { CreateMessageDto } from 'src/messages/dtos/create-message.dto';
import { MessagesService } from 'src/messages/providers/message.service';
import { Message } from 'src/messages/schemas/message.schema';
import { UsersService } from 'src/users/providers/users.service';
import { WebsocketsService } from './providers/websockets.service';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, set this to your frontend URL
  },
})
@Injectable()
export class WebsocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WebsocketsGateway.name);

  @WebSocketServer() server: Server;

  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly websocketsService: WebsocketsService,
  ) {}

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      // Get token from handshake auth
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      // Verify token
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Store user connection
      this.websocketsService.addUser(userId, client.id);

      // Join personal room
      client.join(userId);

      // Get user's chats and join those rooms
      const chats = await this.chatsService.getChatsForUser(userId);
      chats.forEach((chat: any) => {
        client.join(chat._id.toString());
      });

      this.logger.log(`Client connected: ${client.id} - User: ${userId}`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.websocketsService.removeUserBySocketId(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_chat')
  handleJoinChat(client: Socket, chatId: string) {
    client.join(chatId);
    client.to(chatId).emit('user_joined', {
      chatId,
      userId: this.websocketsService.getUserIdBySocketId(client.id),
    });
  }

  @SubscribeMessage('leave_chat')
  handleLeaveChat(client: Socket, chatId: string) {
    client.leave(chatId);
    client.to(chatId).emit('user_left', {
      chatId,
      userId: this.websocketsService.getUserIdBySocketId(client.id),
    });
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(client: Socket, payload: CreateMessageDto) {
    try {
      const userId = this.websocketsService.getUserIdBySocketId(client.id);

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Save message to database
      const message = await this.messagesService.createMessage(payload, userId);

      // Send message to chat room
      this.server.to(payload.chatId).emit('new_message', message);

      // Send notification to all users in the chat (except sender)
      const chat = await this.chatsService.createOrGetChat(
        payload.chatId,
        userId,
      );
      if (!chat) {
        throw new Error('Chat not found');
      }
      chat.users.forEach((user) => {
        const userIdStr = user.toString();
        if (userIdStr !== userId) {
          this.server.to(userIdStr).emit('message_notification', {
            chatId: payload.chatId,
            message: message,
          });
        }
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, data: { chatId: string; isTyping: boolean }) {
    const userId = this.websocketsService.getUserIdBySocketId(client.id);

    client.to(data.chatId).emit('typing', {
      chatId: data.chatId,
      userId: userId,
      isTyping: data.isTyping,
    });
  }
  // Add this to your websockets.gateway.ts in the SubscribeMessage section

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    client: Socket,
    payload: { chatId: string; messageId: string },
  ) {
    try {
      const userId = this.websocketsService.getUserIdBySocketId(client.id);
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Update message in database to add user to readBy array
      await this.messagesService.markMessageAsRead(payload.messageId, userId);

      // Emit to chat that message has been read
      this.server.to(payload.chatId).emit('message_read', {
        messageId: payload.messageId,
        userId: userId,
        chatId: payload.chatId,
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  async markMessageAsRead(messageId: string, userId: string) {
    return this.messageModel
      .findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: userId } },
        { new: true },
      )
      .populate('sender', '-password');
  }
}

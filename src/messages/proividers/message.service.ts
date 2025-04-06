import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatsService } from 'src/chats/providers/chats.service';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { Message } from '../schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly chatsService: ChatsService,
  ) {}

  async createMessage(dto: CreateMessageDto, userId: string) {
    const newMessage = await this.messageModel.create({
      sender: userId,
      content: dto.content,
      chat: dto.chatId,
    });
    if (!newMessage) {
      throw new RequestTimeoutException('Unable to process your request');
    }
    await this.chatsService.uLatestMessage(dto.chatId, newMessage._id);

    return newMessage.populate('sender', '-password');
  }

  async getMessagesByChat(chatId: string) {
    return this.messageModel
      .find({ chat: chatId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });
  }
}

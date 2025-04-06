import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from '../schemas/chat.schema';

@Injectable()
export class UpdateLatestMessage {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}
  async updateLatestMessage(chatId: string, messageId) {
    return this.chatModel.findByIdAndUpdate(chatId, {
      latestMessage: messageId,
    });
  }
}

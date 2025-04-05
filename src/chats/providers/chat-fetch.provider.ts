import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from '../schemas/chat.schema';

@Injectable()
export class ChatFetchProvider {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async getChatsForUser(userId: string) {
    return this.chatModel
      .find({ users: { $elemMatch: { $eq: userId } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });
  }
}

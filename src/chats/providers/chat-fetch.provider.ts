import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { Chat } from '../schemas/chat.schema';

@Injectable()
export class ChatFetchProvider {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async getChatsForUser(@ActiveUser('sub') userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.chatModel
      .find({ users: userId })
      .populate('users', '-password')
      .populate({
        path: 'latestMessage',
        populate: { path: 'sender', select: 'name email' },
      })
      .sort({ updatedAt: -1 });
  }
}

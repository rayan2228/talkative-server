import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { Chat } from '../schemas/chat.schema';

@Injectable()
export class ChatCreateProvider {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async createOrGetChat(
    userId: string,
    @ActiveUser('sub') currentUserId: string,
  ) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (userId === currentUserId) {
      throw new Error('You cannot create a chat with yourself');
    }
    if (!currentUserId) {
      throw new Error('Current user ID is required');
    }
    const chat = await this.chatModel
      .findOne({
        isGroupChat: false,
        users: { $all: [userId, currentUserId] },
      })
      .populate('users', '-password')
      .populate('latestMessage');

    if (chat) return chat;

    const newChat = await this.chatModel.create({
      isGroupChat: false,
      users: [userId, currentUserId],
    });

    return this.chatModel.findById(newChat._id).populate('users', '-password');
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from '../schemas/chat.schema';

@Injectable()
export class ChatCreateProvider {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async createOrGetChat(userId: string, currentUserId: string) {
    const existingChat = await this.chatModel
      .findOne({
        isGroupChat: false,
        users: { $all: [userId, currentUserId] },
      })
      .populate('users', '-password')
      .populate('latestMessage');

    if (existingChat) return existingChat;

    const chat = await this.chatModel.create({
      chatName: 'Chat',
      isGroupChat: false,
      users: [userId, currentUserId],
    });

    return this.chatModel
      .findById(chat._id)
      .populate('users', '-password')
      .populate('latestMessage');
  }
}

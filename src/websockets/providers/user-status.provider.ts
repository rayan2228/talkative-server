// src/websockets/user-status.provider.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class UserStatusProvider {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel('Chat') private chatModel: Model<any>,
  ) {}

  async updateUserStatus(userId: string, isOnline: boolean): Promise<void> {
    // Add isOnline field to your User schema if needed
    await this.userModel.findByIdAndUpdate(userId, { isOnline });
  }

  async getOnlineUsersInChat(chatId: string): Promise<string[]> {
    // Get users that are part of this chat and currently online
    const chat = await this.chatModel.findById(chatId).populate('users');
    if (!chat) return [];

    return chat.users
      .filter((user) => user.isOnline)
      .map((user) => user._id.toString());
  }
}

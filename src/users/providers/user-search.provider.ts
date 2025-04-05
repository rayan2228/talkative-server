// users/providers/user-search.provider.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserSearchProvider {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async search(query: string, currentUserId: string) {
    console.log(currentUserId);

    const searchRegex = new RegExp(query, 'i');

    return this.userModel
      .find({
        _id: { $ne: currentUserId }, // exclude logged-in user
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
        ],
      })
      .select('-password');
  }
}

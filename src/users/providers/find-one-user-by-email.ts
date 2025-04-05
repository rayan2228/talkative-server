import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class FindOneUserByEmail {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async findOneByEmail(email: string) {
    let user: User | null;

    try {
      // This will return null if the user is not found
      user = await this.userModel.findOne({ email });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }

    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }

    return user;
  }
}

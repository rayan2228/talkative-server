import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../schemas/user.schema';
import { UserCreateProvider } from './user-create.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly userCreateProvider: UserCreateProvider,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userCreateProvider.create(createUserDto);
  }
}

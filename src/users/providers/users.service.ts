import { Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FindOneUserByEmail } from './find-one-user-by-email';
import { UserCreateProvider } from './user-create.provider';
import { UserSearchProvider } from './user-search.provider';

@Injectable()
export class UsersService {
  constructor(
    private readonly userCreateProvider: UserCreateProvider,
    private readonly findOneUserByEmail: FindOneUserByEmail,
    private readonly userSearchProvider: UserSearchProvider,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userCreateProvider.create(createUserDto);
  }

  async findByEmail(@Body() email: string) {
    return await this.findOneUserByEmail.findOneByEmail(email);
  }

  async searchUsers(query: string, userId: string) {
    return this.userSearchProvider.search(query, userId);
  }
}

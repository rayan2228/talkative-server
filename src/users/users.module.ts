import { Module } from '@nestjs/common';
import { UserCreateProvider } from './provider/user-create.provider';
import { UsersService } from './provider/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UserCreateProvider],
  exports: [UsersService],
})
export class UsersModule {}

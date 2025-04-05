import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { Auth } from 'src/auth/decorators/auth-decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('register')
  @Auth(AuthType.None)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Get('search')
  @Auth(AuthType.Bearer)
  searchUsers(
    @Query('query') query: string,
    @ActiveUser('sub') userId: string,
  ) {
    return this.usersService.searchUsers(query, userId);
  }
}

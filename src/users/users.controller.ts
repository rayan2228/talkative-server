import { Body, Controller, Post } from '@nestjs/common';
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
}

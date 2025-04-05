import { Body, Controller, Get, Post } from '@nestjs/common';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { CreateChatDto } from './dtos/create-chat.dto';
import { ChatsService } from './providers/chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async createOrGetChat(
    @Body() dto: CreateChatDto,
    @ActiveUser('sub') userId: string,
  ) {
    return this.chatsService.createOrGetChat(dto.userId, userId);
  }

  @Get()
  async getChats(@ActiveUser('sub') userId: string) {
    return this.chatsService.getChatsForUser(userId);
  }
}

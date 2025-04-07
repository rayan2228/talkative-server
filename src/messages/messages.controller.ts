import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './providers/message.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() dto: CreateMessageDto, @ActiveUser('sub') userId: string) {
    return this.messagesService.createMessage(dto, userId);
  }

  @Get()
  getMessages(@Query('chatId') chatId: string) {
    return this.messagesService.getMessagesByChat(chatId);
  }
}

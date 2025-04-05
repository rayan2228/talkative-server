// chats.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsController } from './chats.controller';
import { ChatCreateProvider } from './providers/chat-create.provider';
import { ChatFetchProvider } from './providers/chat-fetch.provider';
import { ChatsService } from './providers/chats.service';
import { Chat, ChatSchema } from './schemas/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatCreateProvider, ChatFetchProvider],
  exports: [ChatsService],
})
export class ChatsModule {}

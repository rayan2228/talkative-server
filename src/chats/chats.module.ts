// chats.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from 'src/messages/messages.module';
import { ChatsController } from './chats.controller';
import { ChatCreateProvider } from './providers/chat-create.provider';
import { ChatFetchProvider } from './providers/chat-fetch.provider';
import { ChatsService } from './providers/chats.service';
import { UpdateLatestMessage } from './providers/update-latest-message.provider';
import { Chat, ChatSchema } from './schemas/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    forwardRef(() => MessagesModule),
  ],
  controllers: [ChatsController],
  providers: [
    ChatsService,
    ChatCreateProvider,
    ChatFetchProvider,
    UpdateLatestMessage,
  ],
  exports: [ChatsService],
})
export class ChatsModule {}

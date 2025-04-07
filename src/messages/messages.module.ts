import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsModule } from 'src/chats/chats.module';
import { Chat, ChatSchema } from 'src/chats/schemas/chat.schema';
import { MessagesController } from './messages.controller';
import { MessagesService } from './providers/message.service';
import { Message, MessageSchema } from './schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Chat.name, schema: ChatSchema },
    ]),
    forwardRef(() => ChatsModule),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}

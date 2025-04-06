import { Injectable } from '@nestjs/common';
import { ChatCreateProvider } from './chat-create.provider';
import { ChatFetchProvider } from './chat-fetch.provider';
import { UpdateLatestMessage } from './update-latest-message.provider';
@Injectable()
export class ChatsService {
  constructor(
    private readonly chatCreateProvider: ChatCreateProvider,
    private readonly chatFetchProvider: ChatFetchProvider,
    private readonly updateLatestMessage: UpdateLatestMessage,
  ) {}

  createOrGetChat(userId: string, currentUserId: string) {
    return this.chatCreateProvider.createOrGetChat(userId, currentUserId);
  }

  getChatsForUser(userId: string) {
    return this.chatFetchProvider.getChatsForUser(userId);
  }

  uLatestMessage(chatId: string, messageId: any) {
    return this.updateLatestMessage.updateLatestMessage(chatId, messageId);
  }
}

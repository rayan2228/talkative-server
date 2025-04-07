// src/websockets/websockets.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import jwtConfig from 'src/auth/config/jwt.config';
import { ChatsModule } from 'src/chats/chats.module';
import { MessagesModule } from 'src/messages/messages.module';
import { Message } from 'src/messages/schemas/message.schema';
import { UsersModule } from 'src/users/users.module';
import { WebsocketsService } from './providers/websockets.service';
import { WebsocketsGateway } from './websockets.gateway';

@Module({
  imports: [
    ChatsModule,
    MessagesModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Message.name, schema: Message }]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [WebsocketsGateway, WebsocketsService],
  exports: [WebsocketsService],
})
export class WebsocketsModule {}

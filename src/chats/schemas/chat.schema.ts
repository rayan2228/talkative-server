// src/chats/schemas/chat.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ trim: true })
  chatName: string;

  @Prop({ default: false })
  isGroupChat: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  users: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  latestMessage: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  groupAdmin: Types.ObjectId;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

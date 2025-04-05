import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Chat } from 'src/chats/schemas/chat.schema';
import { User } from 'src/users/schemas/user.schema';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId | User;

  @Prop({ type: String, trim: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  chat: Types.ObjectId | Chat;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  readBy: Types.ObjectId[] | User[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);

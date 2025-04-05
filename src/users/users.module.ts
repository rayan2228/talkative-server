import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { FindOneUserByEmail } from './providers/find-one-user-by-email';
import { UserCreateProvider } from './providers/user-create.provider';
import { UsersService } from './providers/users.service';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserCreateProvider, FindOneUserByEmail],
  exports: [UsersService],
})
export class UsersModule {}

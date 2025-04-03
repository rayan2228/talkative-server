import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './provider/auth.service';
import { BcryptProvider } from './provider/bcrypt.provider';
import { HashingProvider } from './provider/hashing.provider';
import { LoginProvider } from './provider/login.provider';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    AuthService,
    LoginProvider,
  ],
  controllers: [AuthController],
  exports: [AuthService, HashingProvider],
})
export class AuthModule {}

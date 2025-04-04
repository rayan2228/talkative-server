import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import jwtConfig from './config/jwt.config';
import { AuthService } from './provider/auth.service';
import { BcryptProvider } from './provider/bcrypt.provider';
import { HashingProvider } from './provider/hashing.provider';
import { LoginProvider } from './provider/login.provider';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
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

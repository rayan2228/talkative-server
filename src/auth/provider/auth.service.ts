import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { LoginProvider } from './login.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject the signInProvider
     */
    private readonly loginProvider: LoginProvider,
  ) {}
  login(loginDto: LoginDto) {
    return this.loginProvider.login(loginDto);
  }
}

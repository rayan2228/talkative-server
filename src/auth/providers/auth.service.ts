import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-tokens.dto';
import { LoginProvider } from './login.provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject the signInProvider
     */
    private readonly loginProvider: LoginProvider,

    /**
     * Inject the refreshTokensProvider
     */
    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}
  login(loginDto: LoginDto) {
    return this.loginProvider.login(loginDto);
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,

    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public signToken<T>(userId: any, expiresIn: string, payload?: T) {
    return this.jwtService.sign(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
      },
    );
  }

  public generateTokens(user: User) {
    // Generate Access Token with Email
    const accessToken = this.signToken(
        user._id,
        this.jwtConfiguration.expiresIn,
        {
          email: user.email,
        },
      ),
      // Generate Refresh token without email
      refreshToken = this.signToken(
        user._id,
        this.jwtConfiguration.refreshExpiresIn,
        {
          email: user.email,
        },
      );

    return {
      accessToken,
      refreshToken,
    };
  }
}

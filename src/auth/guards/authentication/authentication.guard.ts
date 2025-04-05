import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from 'src/auth/decorators/auth-decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AccessTokenGuard } from '../access-token/access-token.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  // Set the default Auth Type
  private static readonly defaultAuthType = AuthType.Bearer;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes
      .map((type) => this.getGuardByAuthType(type))
      .flat();

    let error = new UnauthorizedException({
      message: 'Authentication failed',
    });

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error = err;

        return false;
      });

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }

  private getGuardByAuthType(type: AuthType): CanActivate {
    switch (type) {
      case AuthType.Bearer:
        return this.accessTokenGuard;
      case AuthType.None:
        return { canActivate: () => true };
      default:
        throw new UnauthorizedException(`Unsupported auth type: ${type}`);
    }
  }
}

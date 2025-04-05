import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/schemas/user.schema';
import { LoginDto } from '../dtos/login.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class LoginProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async login(loginDto: LoginDto) {
    // Find user by email
    const user: User = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Authentication failed: User not found');
    }

    let isEqual: boolean = false;

    try {
      // Compare the password with the hash
      isEqual = await this.hashingProvider.comparePassword(
        loginDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(
        error.message || 'Could not compare the password',
        {
          description: 'Error during password comparison',
        },
      );
    }

    if (!isEqual) {
      throw new UnauthorizedException(
        'Authentication failed: Incorrect password',
      );
    }

    // Generate and return tokens
    return this.generateTokensProvider.generateTokens(user);
  }
}

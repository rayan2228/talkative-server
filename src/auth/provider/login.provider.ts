import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/provider/users.service';
import { LoginDto } from '../dto/login.dto';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class LoginProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async login(loginDto: LoginDto) {
    // find user by email ID
    const user = await this.usersService.findByEmail(loginDto.email);
    // Throw exception if user is not found
    // Above | Taken care by the findInByEmail method

    let isEqual: boolean = false;

    try {
      // Compare the password to hash
      isEqual = await this.hashingProvider.comparePassword(
        loginDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare the password',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Authentication failed');
    }

    // Send confirmation
    return true;
  }
}

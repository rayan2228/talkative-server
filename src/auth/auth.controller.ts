import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Auth } from './decorators/auth-decorator';
import { LoginDto } from './dtos/login.dto';
import { AuthType } from './enums/auth-type.enum';
import { AuthService } from './providers/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    /**
     * Inject the signInProvider
     */
    private readonly authService: AuthService,
  ) {}
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

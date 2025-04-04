import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './provider/auth.service';

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
  public login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

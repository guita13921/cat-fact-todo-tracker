import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    // Delegates registration logic to the service so the controller stays thin
    // and focused on HTTP concerns (validation, routing).
    return this.auth.register(dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    // Returns a signed JWT that the front-end can persist in memory and attach
    // to future requests.
    return this.auth.login(dto.email, dto.password);
  }
}

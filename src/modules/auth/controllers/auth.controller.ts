import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';
import { ApiSuccessResponse } from '@common/responses/api-success-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return new ApiSuccessResponse(await this.authService.register(dto));
  }
}

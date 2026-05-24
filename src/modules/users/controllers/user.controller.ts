import { ApiSuccessResponseDocs } from '@common/decorators/api-success-response-docs.decorator';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import { Controller, Get, HttpCode, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUserId } from '@users/decorators/user.decorator';
import { User } from '@users/entities/user.entity';
import { UserService } from '@users/services/user.service';

@Controller('user')
@ApiTags('User')
@UseInterceptors(ApiSuccessResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/me')
  @HttpCode(200)
  @Throttle({
    default: {
      limit: 10,
      ttl: 60000,
    },
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged in user profile' })
  @ApiSuccessResponseDocs({
    model: User,
    description: 'User profile returned successfully',
  })
  async me(@CurrentUserId() userId: string) {
    return this.userService.findUserById(userId);
  }
}

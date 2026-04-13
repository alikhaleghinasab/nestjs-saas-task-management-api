import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class ProjectModule {}

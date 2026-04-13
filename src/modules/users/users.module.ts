import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repositroy';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UsersModule {}

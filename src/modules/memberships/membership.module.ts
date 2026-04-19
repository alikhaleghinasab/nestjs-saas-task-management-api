import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { MembershipRepository } from './repositories/membership.repository';
import { MembershipService } from './services/membership.service';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteMembershipHandler } from './handlers/delete-membership.handler';
import { CreateMembershipHandler } from './handlers/create-membership.handler';
import { MembershipController } from './controllers/membership.controller';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership]),
    CqrsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [MembershipController],
  providers: [
    MembershipRepository,
    MembershipService,
    CreateMembershipHandler,
    DeleteMembershipHandler,
  ],
  exports: [MembershipService],
})
export class MembershipModule {}

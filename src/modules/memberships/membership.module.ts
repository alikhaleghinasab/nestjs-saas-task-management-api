import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { MembershipRepository } from './repositories/membership.repository';
import { MembershipService } from './services/membership.service';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteMembershipHandler } from './handlers/delete-membership.handler';
import { CreateMembershipHandler } from './handlers/create-membership.handler';
import { MembershipController } from './controllers/membership.controller';
import { MembershipAccessService } from './services/membership-access.service';

@Module({
  imports: [TypeOrmModule.forFeature([Membership]), CqrsModule],
  controllers: [MembershipController],
  providers: [
    MembershipRepository,
    MembershipService,
    MembershipAccessService,
    CreateMembershipHandler,
    DeleteMembershipHandler,
  ],
  exports: [MembershipService, MembershipAccessService],
})
export class MembershipModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { MembershipRepository } from './repositories/membership.repository';
import { MembershipService } from './services/membership.service';

@Module({
  imports: [TypeOrmModule.forFeature([Membership])],
  providers: [MembershipRepository, MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}

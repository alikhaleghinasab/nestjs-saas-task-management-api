import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationController } from './controllers/organization.controller';
import { OrganizationService } from './services/organization.service';
import { OrganizationRepository } from './repositories/organization.repository';
import { AuthModule } from '@auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { MembershipModule } from '@memberships/membership.module';
import { OrganizationRolesGuard } from './guards/organization-roles.guard';
import { InvitationController } from './controllers/invitation.controller';
import { Invitation } from './entities/invitation.entity';
import { InvitationService } from './services/invitation.service';
import { InvitationRepository } from './repositories/invitation.repository';
import { EmailModule } from '@email/email.module';

@Module({
  controllers: [OrganizationController, InvitationController],
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Organization, Invitation]),
    AuthModule,
    EmailModule,
    MembershipModule,
  ],
  providers: [
    OrganizationService,
    OrganizationRepository,
    InvitationService,
    InvitationRepository,
    OrganizationRolesGuard,
  ],
  exports: [OrganizationRolesGuard],
})
export class OrganizationModule {}

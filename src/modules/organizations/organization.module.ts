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

@Module({
  controllers: [OrganizationController],
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Organization]),
    AuthModule,
    MembershipModule,
  ],
  providers: [
    OrganizationService,
    OrganizationRepository,
    OrganizationRolesGuard,
  ],
  exports: [OrganizationRolesGuard],
})
export class OrganizationModule {}

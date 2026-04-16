import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationController } from './controllers/organization.controller';
import { OrganizationService } from './services/organization.service';
import { OrganizationRepository } from './repositories/organization.repository';
import { AuthModule } from '@auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  controllers: [OrganizationController],
  imports: [CqrsModule, TypeOrmModule.forFeature([Organization]), AuthModule],
  providers: [OrganizationService, OrganizationRepository],
  exports: [],
})
export class OrganizationModule {}

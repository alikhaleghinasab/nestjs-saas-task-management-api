import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationController } from './controllers/organization.controller';
import { OrganizationService } from './services/organization.service';
import { OrganizationRepository } from './repositories/organization.repository';
import { AuthModule } from '@auth/auth.module';

@Module({
  controllers: [OrganizationController],
  imports: [TypeOrmModule.forFeature([Organization]), AuthModule],
  providers: [OrganizationService, OrganizationRepository],
  exports: [],
})
export class OrganizationModule {}

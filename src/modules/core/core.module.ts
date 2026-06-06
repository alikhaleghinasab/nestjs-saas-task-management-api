import { Module } from '@nestjs/common';
import { OrganizationModule } from '@organizations/organization.module';
import { MembershipModule } from '@memberships/membership.module';
import { CacheModule } from '@cache/cache.module';
import { CacheDriver } from '@cache/cache-driver.enum';
import { ProjectsModule } from '@projects/projects.module';
import { TasksModule } from '@tasks/tasks.module';
import { APP_GUARD } from '@nestjs/core';
import { OrganizationContextGuard } from '@organizations/guards/organization-context.guard';
import { OrganizationRolesGuard } from '@organizations/guards/organization-roles.guard';

@Module({
  imports: [
    OrganizationModule,
    MembershipModule,
    ProjectsModule,
    TasksModule,
    CacheModule.forRoot({ driver: CacheDriver.REDIS }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: OrganizationContextGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OrganizationRolesGuard,
    },
  ],
})
export class CoreModule {}

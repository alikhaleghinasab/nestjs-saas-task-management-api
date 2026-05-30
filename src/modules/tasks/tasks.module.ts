import { Module } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './services/task.service';
import { TaskRepository } from './repositories/task.repository';
import { TaskController } from './controllers/task.controller';
import { ProjectsModule } from '@projects/projects.module';
import { MembershipModule } from '@memberships/membership.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), ProjectsModule, MembershipModule],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class TasksModule {}

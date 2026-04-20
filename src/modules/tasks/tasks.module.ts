import { Module } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './services/task.service';
import { TaskRepository } from './repositories/task.repository';
import { MembershipModule } from '@memberships/membership.module';
import { TaskController } from './controllers/task.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), MembershipModule],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class TasksModule {}

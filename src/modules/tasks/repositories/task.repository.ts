import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskInterface } from '../interfaces/task-params.interface';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
  ) {}

  async create(data: CreateTaskInterface): Promise<Task> {
    const task = this.repo.create(data);
    return this.repo.save(task);
  }
}

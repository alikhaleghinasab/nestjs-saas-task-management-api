import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserParams } from '@users/interfaces/create-user.interface';
import { CheckUserExistsInterface } from '@users/interfaces/check-user-exists.interface';
import { USER_ERRORS } from '@users/constants/errors.constant';
import { CatchUniqueConstraint } from '@common/decorators/catch-unique-constraint.decorator';
import { AuthUser } from '@users/types/auth-user.type';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  @CatchUniqueConstraint(USER_ERRORS.EMAIL_EXISTS)
  async create(data: CreateUserParams): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findOneForAuth(
    data: CheckUserExistsInterface,
  ): Promise<AuthUser | null> {
    return this.repo.findOne({
      where: data,
      select: ['id', 'email', 'password', 'isActive'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserParams } from '@users/interfaces/create-user.interface';
import { isUniqueConstraintError } from '@common/utils/database/is-unique-constraint-error.util';
import { UniqueConstraintException } from '@common/exceptions/unique-constraint.exception';
import { CheckUserExistsInterface } from '@users/interfaces/check-user-exists.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async createUser(data: CreateUserParams): Promise<User> {
    try {
      const user = this.repo.create(data);
      return this.repo.save(user);
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        throw new UniqueConstraintException('Email already exists');
      }
      throw err;
    }
  }

  async checkUserExists(
    data: CheckUserExistsInterface,
  ): Promise<Pick<User, 'id' | 'email' | 'password' | 'isActive'> | null> {
    return this.repo.findOne({
      where: data,
      select: ['id', 'email', 'password', 'isActive'],
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }
}

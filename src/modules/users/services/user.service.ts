import { Injectable } from '@nestjs/common';
import { CheckUserExistsInterface } from '@users/interfaces/check-user-exists.interface';
import { CreateUserParams } from '@users/interfaces/create-user.interface';
import { UserRepository } from '@users/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(data: CreateUserParams) {
    return this.userRepository.create(data);
  }
  async findUserById(id: string) {
    return this.userRepository.findById(id);
  }
  async findUserForAuth(data: CheckUserExistsInterface) {
    return this.userRepository.findOneForAuth(data);
  }
}

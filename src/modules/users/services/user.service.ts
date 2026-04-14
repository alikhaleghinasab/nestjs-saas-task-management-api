import { Injectable } from '@nestjs/common';
import { UserRepository } from '@users/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findUserById(id: string) {
    return this.userRepository.findUserById(id);
  }
}

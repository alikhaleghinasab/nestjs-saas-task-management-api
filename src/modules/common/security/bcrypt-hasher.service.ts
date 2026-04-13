import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptHasher {
  async hash(plain: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(plain, saltRounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}

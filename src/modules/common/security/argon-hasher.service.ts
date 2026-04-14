import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class ArgonHasher {
  private readonly defaultOptions: argon2.Options = {
    type: argon2.argon2id,
    timeCost: 3,
    memoryCost: 2 ** 16, // 64 MB in KiB
    parallelism: 4,
  };
  async hash(plain: string, options?: argon2.Options): Promise<string> {
    return await argon2.hash(plain, {
      ...this.defaultOptions,
      ...options,
    });
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, plain);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CacheProviderInterface } from './cache-provider.interface';
import { CACHE_PROVIDER } from './cache.constant';

@Injectable()
export class CacheVersionService {
  constructor(
    @Inject(CACHE_PROVIDER)
    private readonly cacheProvider: CacheProviderInterface,
  ) {}

  private getKey(scope: string, id: string): string {
    return `${scope}:${id}:version`;
  }

  async get(scope: string, id: string): Promise<number> {
    const value = await this.cacheProvider.get(this.getKey(scope, id));
    return value ? Number(value) : 1;
  }

  async bump(scope: string, id: string) {
    await this.cacheProvider.increment(this.getKey(scope, id));
  }
}

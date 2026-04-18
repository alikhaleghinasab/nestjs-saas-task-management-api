import { CacheHelper } from './cache.helper';

type CacheKeyFn<Args extends unknown[]> = (...args: Args) => string;

interface CacheOptions<Args extends unknown[]> {
  key?: string | CacheKeyFn<Args>;
  ttl?: number;
}
export function CacheResult<Args extends unknown[] = unknown[]>(
  options?: CacheOptions<Args>,
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: Args) {
      const cacheHelper: CacheHelper = (this as any).cacheHelper;

      if (!cacheHelper) {
        throw new Error(
          `CacheHelper not found on ${this.constructor.name}. Inject it via constructor.`,
        );
      }

      const key =
        typeof options?.key === 'function'
          ? options.key(...args)
          : options?.key;
      if (!key) {
        throw new Error('Cache key not defined');
      }

      return cacheHelper.getOrSetString(
        key,
        () => originalMethod.apply(this, args),
        options?.ttl,
      );
    };

    return descriptor;
  };
}

import { CacheHelper } from './cache.helper';

export function CacheResult(options?: { key?: string; ttl?: number }) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const cacheHelper: CacheHelper = (this as any).cacheHelper;

      if (!cacheHelper) {
        throw new Error(
          `CacheHelper is missing. Ensure it is injected as 'private readonly cacheHelper' in ${this.constructor.name}.`,
        );
      }

      const key =
        options?.key ??
        `${this.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;

      const ttl = options?.ttl;

      return await cacheHelper.getOrSetString(
        key,
        () => originalMethod.apply(this, args),
        ttl,
      );
    };

    return descriptor;
  };
}

import { EntityNotFoundException } from '@common/exceptions/entity-not-found.exception';

export function EnsureAffected(error?: string) {
  return function (
    target: Record<string, any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await original.apply(this, args);
      if (!result) {
        throw new EntityNotFoundException(error);
      }
      return result;
    };

    return descriptor;
  };
}

import { RecordNotFoundError } from '@common/errors/domain/record-not-found.error';

export function EnsureFound(error?: string) {
  return function (
    target: Record<string, any>,
    key: string,
    desc: PropertyDescriptor,
  ) {
    const original = desc.value;

    desc.value = async function (...args: any[]) {
      const result = await original.apply(this, args);

      if (result === null) {
        throw new RecordNotFoundError(error);
      }

      return result;
    };

    return desc;
  };
}

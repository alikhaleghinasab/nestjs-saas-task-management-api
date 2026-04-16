import { UniqueConstraintException } from '@common/exceptions/unique-constraint.exception';
import { isUniqueConstraintError } from '@common/utils/database/is-unique-constraint-error.util';

type UniqueConstraintConfig = string | Record<string, string>;

export function CatchUniqueConstraint(config: UniqueConstraintConfig) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error: any) {
        if (isUniqueConstraintError(error)) {
          if (typeof config === 'string') {
            throw new UniqueConstraintException(config);
          }

          const constraint = error?.constraint;

          const message =
            (constraint && config[constraint]) || 'Unique constraint violated';

          throw new UniqueConstraintException(message);
        }

        throw error;
      }
    };

    return descriptor;
  };
}

import { ForeignKeyConstraintError } from '@common/errors/domain/foreign-key-constraint.error';
import { ErrorCode } from '@common/errors/error-codes';
import { ErrorMessage } from '@common/errors/error-messages';
import { isForeignKeyConstraintError } from '@common/utils/database/is-foreign-key-error.util';

export function CatchForeignKeyConstraint(columnMap: Record<string, string>) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error: any) {
        if (isForeignKeyConstraintError(error)) {
          const columnName = extractForeignKeyColumn(error);

          if (columnName && columnMap[columnName]) {
            const customEntityName = columnMap[columnName];
            throw new ForeignKeyConstraintError(
              `The ${customEntityName} does not exist.`,
            );
          }

          throw new ForeignKeyConstraintError(
            ErrorMessage[ErrorCode.ForeignKeyConstraint],
          );
        }

        throw error;
      }
    };

    return descriptor;
  };
}

function extractForeignKeyColumn(error: any): string | null {
  const detail = error.detail || '';
  const match = detail.match(/Key \((.*?)\)=/);
  return match ? match[1] : null;
}

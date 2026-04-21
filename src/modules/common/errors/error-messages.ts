import { ErrorCode } from './error-codes';

export const ErrorMessage = {
  [ErrorCode.Internal]: 'An unexpected error occurred.',
  [ErrorCode.RecordNotFound]: 'Record not found.',
  [ErrorCode.ForeignKeyConstraint]: 'A referenced record does not exist.',
  TRY_AGAIN: 'Try again please.',
  Generic: 'An error occurred',
} as const;

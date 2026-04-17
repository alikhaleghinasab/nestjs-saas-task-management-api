import { ErrorCode } from './error-codes';

export const ErrorMessage = {
  [ErrorCode.Internal]: 'An unexpected error occurred.',
  [ErrorCode.RecordNotFound]: 'Record not found.',
  Generic: 'An error occurred',
} as const;

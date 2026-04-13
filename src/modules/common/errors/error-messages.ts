import { ErrorCode } from './error-codes';

export const ErrorMessage = {
  [ErrorCode.Internal]: 'An unexpected error occurred.',
  Generic: 'An error occurred',
} as const;

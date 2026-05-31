import { BaseException } from '@common/exceptions/base.exception';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';

export class ContextMismatchException extends BaseException {
  static readonly statusCode = 403;
  static readonly errorCode = 'CONTEXT_MISMATCH';
  static readonly message = ORGANIZATION_ERRORS.CONTEXT_MISMATCH;

  constructor() {
    super(ContextMismatchException);
  }
}

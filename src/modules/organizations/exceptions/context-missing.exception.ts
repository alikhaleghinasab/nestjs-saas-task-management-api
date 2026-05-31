import { BaseException } from '@common/exceptions/base.exception';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';

export class ContextMissingException extends BaseException {
  static readonly statusCode = 400;
  static readonly errorCode = 'CONTEXT_MISSING';
  static readonly message = ORGANIZATION_ERRORS.CONTEXT_MISSING;

  constructor() {
    super(ContextMissingException);
  }
}

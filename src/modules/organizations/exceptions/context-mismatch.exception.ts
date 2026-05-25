import { BaseException } from '@common/exceptions/base.exception';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';

export class ContextMismatchException extends BaseException {
  constructor() {
    super('CONTEXT_MISMATCH', 403, ORGANIZATION_ERRORS.CONTEXT_MISMATCH);
  }
}

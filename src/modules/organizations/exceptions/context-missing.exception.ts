import { BaseException } from '@common/exceptions/base.exception';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';

export class ContextMissingException extends BaseException {
  constructor() {
    super('CONTEXT_MISSING', 400, ORGANIZATION_ERRORS.CONTEXT_MISSING);
  }
}

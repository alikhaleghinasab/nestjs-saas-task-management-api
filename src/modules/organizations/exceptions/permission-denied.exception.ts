import { ErrorCode } from '@common/errors/error-codes';
import { BaseException } from '@common/exceptions/base.exception';

export class PermissionDeniedException extends BaseException {
  constructor(message: string) {
    super(ErrorCode.PermissionDenied, 403, message);
  }
}

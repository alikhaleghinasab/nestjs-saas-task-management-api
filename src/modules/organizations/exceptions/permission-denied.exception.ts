import { ErrorCode } from '@common/errors/error-codes';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';
import { BaseException } from '@common/exceptions/base.exception';

export class PermissionDeniedException extends BaseException {
  static readonly statusCode = 403;
  static readonly errorCode = ErrorCode.PermissionDenied;
  static readonly message = ORGANIZATION_ERRORS.PERMISSION_DENIED;

  constructor(message: string) {
    super(PermissionDeniedException, message);
  }
}

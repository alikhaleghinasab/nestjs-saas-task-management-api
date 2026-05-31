import { ErrorCode } from '@common/errors/error-codes';
import { ErrorMessage } from '@common/errors/error-messages';
import { BaseException } from './base.exception';

export class UniqueConstraintException extends BaseException {
  static readonly statusCode = 409;
  static readonly errorCode = ErrorCode.UniqueConstraint;
  static readonly message = ErrorMessage.Generic;

  constructor(message: string) {
    super(UniqueConstraintException, message);
  }
}

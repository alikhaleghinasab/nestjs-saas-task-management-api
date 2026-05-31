import { ErrorCode } from '@common/errors/error-codes';
import { ErrorMessage } from '@common/errors/error-messages';
import { BaseException } from './base.exception';

export class ForeignKeyConstraintException extends BaseException {
  static readonly statusCode = 400;
  static readonly errorCode = ErrorCode.ForeignKeyConstraint;
  static readonly message = ErrorMessage[ErrorCode.ForeignKeyConstraint];

  constructor(message: string) {
    super(ForeignKeyConstraintException, message);
  }
}

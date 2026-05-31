import { ErrorCode } from '@common/errors/error-codes';
import { BaseException } from './base.exception';
import { ErrorMessage } from '@common/errors/error-messages';

export class RecordNotFoundException extends BaseException {
  static readonly statusCode = 404;
  static readonly errorCode = ErrorCode.RecordNotFound;
  static readonly message = ErrorMessage[ErrorCode.RecordNotFound];

  constructor(message?: string) {
    super(RecordNotFoundException, message);
  }
}

import { ErrorCode } from '@common/errors/error-codes';
import { ErrorMessage } from '@common/errors/error-messages';
import { BaseException } from './base.exception';

export class DynamicFilterInvalidDataException extends BaseException {
  static readonly statusCode = 400;
  static readonly errorCode = ErrorCode.DynamicFilterInvalidData;
  static readonly message = ErrorMessage.Generic;

  constructor(message: string) {
    super(DynamicFilterInvalidDataException, message);
  }
}

import { ErrorCode } from '@common/errors/error-codes';
import { BaseException } from './base.exception';
import { ErrorMessage } from '@common/errors/error-messages';

export class RecordNotFoundException extends BaseException {
  constructor(message: string = ErrorMessage[ErrorCode.RecordNotFound]) {
    super(ErrorCode.RecordNotFound, 404, message);
  }
}

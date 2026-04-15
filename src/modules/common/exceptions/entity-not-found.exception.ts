import { ErrorCode } from '@common/errors/error-codes';
import { BaseException } from './base.exception';
import { ErrorMessage } from '@common/errors/error-messages';

export class EntityNotFoundException extends BaseException {
  constructor(message: string = ErrorMessage[ErrorCode.EntityNotFound]) {
    super(ErrorCode.EntityNotFound, 404, message);
  }
}

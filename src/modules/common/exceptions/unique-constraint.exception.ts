import { ErrorCode } from '@common/errors/error-codes';
import { BaseException } from './base.exception';

export class UniqueConstraintException extends BaseException {
  constructor(message: string) {
    super(ErrorCode.UniqueConstraint, 409, message);
  }
}

import { ErrorCode } from '@common/errors/error-codes';
import { BaseException } from './base.exception';

export class ForeignKeyConstraintException extends BaseException {
  constructor(message: string) {
    super(ErrorCode.ForeignKeyConstraint, 400, message);
  }
}

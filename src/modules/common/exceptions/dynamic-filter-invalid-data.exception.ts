import { ErrorCode } from '@common/errors/error-codes';
import { BaseException } from './base.exception';

export class DynamicFilterInvalidDataException extends BaseException {
  constructor(message: string) {
    super(ErrorCode.DynamicFilterInvalidData, 400, message);
  }
}

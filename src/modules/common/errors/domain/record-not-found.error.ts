import { ErrorCode } from '../error-codes';
import { ErrorMessage } from '../error-messages';
import { DomainError } from './domain.error';

export class RecordNotFoundError extends DomainError {
  constructor(message: string = ErrorMessage[ErrorCode.RecordNotFound]) {
    super(message);
  }
}

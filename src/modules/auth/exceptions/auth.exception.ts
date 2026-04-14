import { BaseException } from '@common/exceptions/base.exception';

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super('INVALID_CREDENTIALS', 401, 'Invalid credentials');
  }
}

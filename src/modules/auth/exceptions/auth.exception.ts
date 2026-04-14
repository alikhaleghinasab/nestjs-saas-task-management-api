import { BaseException } from '@common/exceptions/base.exception';

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super('INVALID_CREDENTIALS', 401, 'Invalid credentials');
  }
}

export class InvalidRefreshTokenException extends BaseException {
  constructor() {
    super('INVALID_REFRESH_TOKEN', 401, 'Token invalid or expired');
  }
}

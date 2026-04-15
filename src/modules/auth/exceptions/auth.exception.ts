import { AUTH_ERRORS } from '@auth/constants/errors.constant';
import { BaseException } from '@common/exceptions/base.exception';

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super('INVALID_CREDENTIALS', 401, AUTH_ERRORS.INVALID_CREDENTIALS);
  }
}

export class InvalidRefreshTokenException extends BaseException {
  constructor() {
    super('INVALID_REFRESH_TOKEN', 401, AUTH_ERRORS.INVALID_REFRESH_TOKEN);
  }
}

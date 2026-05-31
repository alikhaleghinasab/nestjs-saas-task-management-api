import { AUTH_ERRORS } from '@auth/constants/errors.constant';
import { BaseException } from '@common/exceptions/base.exception';

export class InvalidCredentialsException extends BaseException {
  static readonly statusCode = 401;
  static readonly errorCode = 'INVALID_CREDENTIALS';
  static readonly message = AUTH_ERRORS.INVALID_CREDENTIALS;

  constructor() {
    super(InvalidCredentialsException);
  }
}

export class InvalidRefreshTokenException extends BaseException {
  static readonly statusCode = 401;
  static readonly errorCode = 'INVALID_REFRESH_TOKEN';
  static readonly message = AUTH_ERRORS.INVALID_REFRESH_TOKEN;

  constructor() {
    super(InvalidRefreshTokenException);
  }
}

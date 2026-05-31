import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    public readonly errorCode: string,
    httpCode: number,
    message: string | string[],
  ) {
    super(message, httpCode);
  }
}

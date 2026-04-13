import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
  public readonly errorCode: string;
  public readonly errorMessage: string | string[];

  constructor(errorCode: string, httpCode: number, message: string | string[]) {
    super(message, httpCode);
    this.errorCode = errorCode;
    this.errorMessage = message;
  }
}

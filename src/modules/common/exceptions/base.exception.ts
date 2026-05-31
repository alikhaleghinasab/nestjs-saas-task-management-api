import { HttpException } from '@nestjs/common';
import { IExceptionClass } from '../interfaces/exception-class.interface';

export abstract class BaseException extends HttpException {
  readonly errorCode: string;

  constructor(ctor: IExceptionClass, message?: string) {
    const finalMessage = message ?? ctor.message;
    const statusCode = ctor.statusCode;
    const errorCode = ctor.errorCode;

    super(finalMessage, statusCode);
    this.errorCode = errorCode;
  }
}

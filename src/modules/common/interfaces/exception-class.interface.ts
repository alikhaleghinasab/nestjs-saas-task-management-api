import { BaseException } from '../exceptions/base.exception';

export interface IExceptionClass {
  statusCode: number;
  errorCode: string;
  message?: string;

  new (...args: any[]): BaseException;
}

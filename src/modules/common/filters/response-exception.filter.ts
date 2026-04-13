import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ApiErrorResponse } from '../responses/api-error-response.dto';
import { BaseException } from '@common/exceptions/base.exception';
import { ErrorCode, httpErrorCode } from '@common/errors/error-codes';
import { ErrorMessage } from '@common/errors/error-messages';

type HttpExceptionResponse =
  | string
  | {
      message?: string | string[];
      [key: string]: any;
    };

@Catch()
export class ResponseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ResponseExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const { status, errorCode, message } = this.normalizeException(exception);
    const response = new ApiErrorResponse(errorCode, message);

    httpAdapter.reply(ctx.getResponse(), response, status);
  }

  private normalizeException(exception: unknown) {
    if (exception instanceof BaseException) {
      return {
        status: exception.getStatus(),
        errorCode: exception.errorCode,
        message: exception.errorMessage,
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resp = exception.getResponse() as HttpExceptionResponse;

      return {
        status,
        errorCode: httpErrorCode(status),
        message: this.extractMessage(resp),
      };
    }

    this.logger.error(exception);

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errorCode: ErrorCode.Internal,
      message: ErrorMessage.INTERNAL_SERVER_ERROR,
    };
  }

  private extractMessage(resp: HttpExceptionResponse): string | string[] {
    if (typeof resp === 'string') return resp;

    if (resp && typeof resp === 'object' && 'message' in resp) {
      return resp.message ?? ErrorMessage.Generic;
    }

    return ErrorMessage.Generic;
  }
}

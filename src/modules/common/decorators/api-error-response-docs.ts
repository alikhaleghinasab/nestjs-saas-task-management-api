import { httpErrorCode } from '@common/errors/error-codes';
import { BaseException } from '@common/exceptions/base.exception';
import { ApiErrorResponse } from '@common/responses/api-error-response.dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

type ExceptionType = Type<Error>;

export function ApiErrorResponsesDocs(...exceptions: ExceptionType[]) {
  const decorators = exceptions.map((ExceptionClass) => {
    const instance: any = new ExceptionClass();

    const status =
      typeof instance.getStatus === 'function' ? instance.getStatus() : 500;

    const errorCode =
      instance instanceof BaseException
        ? instance.errorCode
        : httpErrorCode(status);

    const errorExample: ApiErrorResponse = {
      success: false,
      errorCode: errorCode,
      message: 'string',
    };
    return ApiResponse({
      status,
      schema: {
        example: errorExample,
      },
    });
  });

  return applyDecorators(...decorators);
}

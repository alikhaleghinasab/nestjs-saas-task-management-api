import { httpErrorCode } from '@common/errors/error-codes';
import { BaseException } from '@common/exceptions/base.exception';
import { ApiErrorResponse } from '@common/responses/api-error-response.dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

type ExceptionType = Type<Error>;

interface ApiErrorOption {
  exception: ExceptionType;
  message?: string;
}

export function ApiErrorResponsesDocs(
  ...errors: (ExceptionType | ApiErrorOption)[]
) {
  const decorators = errors.map((error) => {
    const ExceptionClass =
      typeof error === 'function' ? error : error.exception;
    const customMessage =
      typeof error === 'function' ? undefined : error.message;

    const instance: any = new ExceptionClass();

    const status =
      typeof instance.getStatus === 'function' ? instance.getStatus() : 500;

    const errorCode =
      instance instanceof BaseException
        ? instance.errorCode
        : httpErrorCode(status);

    const errorExample: ApiErrorResponse = {
      success: false,
      errorCode,
      message: customMessage ?? 'string',
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

import { HttpException, Type } from '@nestjs/common';
import { httpErrorCode } from '@common/errors/error-codes';
import { IExceptionClass } from '@common/interfaces/exception-class.interface';
import { ApiErrorResponse } from '@common/responses/api-error-response.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

type ExceptionType = Type<Error> | IExceptionClass;

interface ApiErrorOption {
  exception: ExceptionType;
  message?: string;
}

function isCustomException(cls: ExceptionType): cls is IExceptionClass {
  return 'statusCode' in cls && 'errorCode' in cls;
}

type HttpExceptionClass = new (...args: any[]) => HttpException;

function isHttpExceptionClass(cls: ExceptionType): cls is HttpExceptionClass {
  return cls.prototype instanceof HttpException;
}

function getExceptionMetadata(ExceptionClass: ExceptionType) {
  if (isCustomException(ExceptionClass)) {
    return {
      status: ExceptionClass.statusCode,
      errorCode: ExceptionClass.errorCode,
      message: ExceptionClass.message,
    };
  }

  if (isHttpExceptionClass(ExceptionClass)) {
    const instance = new ExceptionClass();
    const status = instance.getStatus();
    return {
      status,
      errorCode: httpErrorCode(status),
      message: instance.message,
    };
  }

  return {
    status: 500,
    errorCode: httpErrorCode(500),
    message: 'Internal server error',
  };
}

export function ApiErrorResponsesDocs(
  ...errors: (ExceptionType | ApiErrorOption)[]
) {
  const decorators = errors.map((error) => {
    const ExceptionClass =
      typeof error === 'function' ? error : error.exception;
    const customMessage =
      typeof error === 'function' ? undefined : error.message;

    const {
      status,
      errorCode,
      message: defaultMessage,
    } = getExceptionMetadata(ExceptionClass);

    const errorExample: ApiErrorResponse = {
      success: false,
      errorCode,
      message: customMessage ?? defaultMessage ?? 'string',
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

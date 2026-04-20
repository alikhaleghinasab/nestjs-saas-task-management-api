import {
  applyDecorators,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiSuccessResponseDocs } from './api-success-response-docs.decorator';
import { ApiPaginatedResponseDocs } from './api-paginated-response-docs.decorator';
import { ApiErrorResponsesDocs } from './api-error-response-docs.decorator';
import { ApiPaginatedResponseInterceptor } from '../interceptors/api-paginated-response.interceptor';
import { RecordNotFoundException } from '../exceptions/record-not-found.exception';
import { UniqueConstraintException } from '../exceptions/unique-constraint.exception';
import {
  ApiGetManyOptions,
  ApiCreateOptions,
  ApiGetOneOptions,
  ApiDeleteOptions,
  ApiUpdateOptions,
} from './api-crud.types';

export function ApiGetMany(options: ApiGetManyOptions) {
  const {
    entity,
    resourceName,
    description = `Paginated list of ${resourceName}`,
    extraErrors = [],
  } = options;

  return applyDecorators(
    Get(),
    UseInterceptors(ApiPaginatedResponseInterceptor),
    ApiOperation({ summary: `Get list of ${resourceName}` }),
    ApiPaginatedResponseDocs({ model: entity, description }),
    ApiErrorResponsesDocs(...extraErrors),
  );
}

export function ApiGetOne(options: ApiGetOneOptions) {
  const {
    entity,
    resourceName,
    paramName = 'id',
    description = `${resourceName} details retrieved`,
    notFoundException = RecordNotFoundException,
    extraErrors = [],
  } = options;

  return applyDecorators(
    Get(`:${paramName}`),
    ApiOperation({ summary: `Get ${resourceName}` }),
    ApiSuccessResponseDocs({ model: entity, description }),
    ApiErrorResponsesDocs(notFoundException),
    ...extraErrors.map((e) => ApiErrorResponsesDocs(e)),
  );
}

export function ApiCreate(options: ApiCreateOptions) {
  const {
    entity,
    resourceName,
    description = `${resourceName} created`,
    duplicateErrorMsg,
    extraErrors = [],
  } = options;

  const decorators: MethodDecorator[] = [
    Post(),
    ApiOperation({ summary: `Create ${resourceName}` }),
    ApiSuccessResponseDocs({ status: 201, model: entity, description }),
    ApiErrorResponsesDocs(...extraErrors),
  ];

  if (duplicateErrorMsg) {
    decorators.push(
      ApiErrorResponsesDocs({
        exception: UniqueConstraintException,
        message: duplicateErrorMsg,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function ApiUpdate(options: ApiUpdateOptions) {
  const {
    resourceName,
    description = `${resourceName} updated`,
    duplicateErrorMsg,
    extraErrors = [],
    paramName = 'id',
  } = options;

  const decorators: MethodDecorator[] = [
    Put(`:${paramName}`),
    HttpCode(200),
    ApiOperation({ summary: `Update ${resourceName}` }),
    ApiSuccessResponseDocs({ description }),
    ApiErrorResponsesDocs(...extraErrors),
  ];

  if (duplicateErrorMsg) {
    decorators.push(
      ApiErrorResponsesDocs({
        exception: UniqueConstraintException,
        message: duplicateErrorMsg,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function ApiDelete(options: ApiDeleteOptions) {
  const {
    resourceName,
    description = `${resourceName} deleted`,
    notFoundException = RecordNotFoundException,
    extraErrors = [],
    paramName = 'id',
  } = options;

  return applyDecorators(
    Delete(`:${paramName}`),
    HttpCode(200),
    ApiOperation({ summary: `Delete ${resourceName}` }),
    ApiSuccessResponseDocs({ description }),
    ApiErrorResponsesDocs(notFoundException),
    ApiErrorResponsesDocs(...extraErrors),
  );
}

import { Type } from '@nestjs/common';

interface ApiErrorDoc {
  exception: Type<any>;
  message?: string;
}

interface ApiBaseOptions {
  resourceName: string;
  description?: string;
  extraErrors?: ApiErrorDoc[];
}

interface ApiWithEntity {
  entity: Type<any>;
}

interface ApiWithNotFound {
  notFoundException?: Type<any>;
}

interface ApiWithDuplicateMessage {
  duplicateErrorMsg?: string;
}

export interface ApiGetManyOptions extends ApiBaseOptions, ApiWithEntity {}

export interface ApiGetOneOptions
  extends ApiBaseOptions, ApiWithEntity, ApiWithNotFound {}

export interface ApiCreateOptions
  extends ApiBaseOptions, ApiWithEntity, ApiWithDuplicateMessage {}

export interface ApiUpdateOptions
  extends ApiBaseOptions, ApiWithDuplicateMessage {}

export interface ApiDeleteOptions extends ApiBaseOptions, ApiWithNotFound {}

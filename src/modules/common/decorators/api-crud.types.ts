import { Type } from '@nestjs/common';

export interface ApiErrorDoc {
  exception: Type<any>;
  message?: string;
}

export interface ApiBaseOptions {
  resourceName: string;
  description?: string;
  extraErrors?: ApiErrorDoc[];
}

export interface ApiGetManyOptions extends ApiBaseOptions {
  entity: Type<any>;
}

export interface ApiGetOneOptions extends ApiBaseOptions {
  entity: Type<any>;
  notFoundException?: Type<any>;
}

export interface ApiCreateOptions extends ApiBaseOptions {
  entity: Type<any>;
  duplicateErrorMsg?: string;
}

export interface ApiUpdateOptions extends ApiBaseOptions {
  duplicateErrorMsg?: string;
}

export interface ApiDeleteOptions extends ApiBaseOptions {
  notFoundException?: Type<any>;
}

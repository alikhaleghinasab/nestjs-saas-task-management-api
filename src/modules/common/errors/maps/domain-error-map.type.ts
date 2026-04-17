import { DomainError } from '../domain/domain.error';

export type DomainErrorMap = Array<{
  domain: new (...args: any[]) => DomainError;
  toHttp: (error: DomainError) => Error;
}>;

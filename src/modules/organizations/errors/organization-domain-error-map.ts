import { DomainErrorMap } from '@common/errors/maps/domain-error-map.type';
import { ContextMismatchError } from './domain/context-mismatch.error';
import { ContextMissingError } from './domain/context-missing.error';
import { ContextMismatchException } from '@organizations/exceptions/context-mismatch.exception';
import { ContextMissingException } from '@organizations/exceptions/context-missing.exception';

export const ORGANIZATION_DOMAIN_ERROR_MAP: DomainErrorMap = [
  {
    domain: ContextMismatchError,
    toHttp: () => new ContextMismatchException(),
  },
  {
    domain: ContextMissingError,
    toHttp: () => new ContextMissingException(),
  },
];

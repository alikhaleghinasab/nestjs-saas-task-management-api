import { DomainError } from '@common/errors/domain/domain.error';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';

export class ContextMissingError extends DomainError {
  constructor() {
    super(ORGANIZATION_ERRORS.CONTEXT_MISSING);
  }
}

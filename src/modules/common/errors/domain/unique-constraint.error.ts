import { DomainError } from './domain.error';

export class UniqueConstraintError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

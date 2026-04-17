import { DomainError } from './domain.error';

export class RecordNotFoundError extends DomainError {
  constructor(message?: string) {
    super(message);
  }
}

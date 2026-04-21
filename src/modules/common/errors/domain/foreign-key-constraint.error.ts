import { DomainError } from './domain.error';
export class ForeignKeyConstraintError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

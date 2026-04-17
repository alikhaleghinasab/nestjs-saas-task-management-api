import { DomainErrorMap } from './domain-error-map.type';

import { RecordNotFoundError } from '../domain/record-not-found.error';
import { UniqueConstraintError } from '../domain/unique-constraint.error';

import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';
import { UniqueConstraintException } from '../../exceptions/unique-constraint.exception';

export const GLOBAL_DOMAIN_ERROR_MAP: DomainErrorMap = [
  {
    domain: RecordNotFoundError,
    toHttp: (e) => new EntityNotFoundException(e.message),
  },
  {
    domain: UniqueConstraintError,
    toHttp: (e) => new UniqueConstraintException(e.message),
  },
];

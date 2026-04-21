import { DomainErrorMap } from './domain-error-map.type';

import { RecordNotFoundError } from '../domain/record-not-found.error';
import { UniqueConstraintError } from '../domain/unique-constraint.error';

import { RecordNotFoundException } from '../../exceptions/record-not-found.exception';
import { UniqueConstraintException } from '../../exceptions/unique-constraint.exception';
import { ForeignKeyConstraintError } from '../domain/foreign-key-constraint.error';
import { ForeignKeyConstraintException } from '../../exceptions/foreign-key-constraint.exception';

export const GLOBAL_DOMAIN_ERROR_MAP: DomainErrorMap = [
  {
    domain: RecordNotFoundError,
    toHttp: (e) => new RecordNotFoundException(e.message),
  },
  {
    domain: UniqueConstraintError,
    toHttp: (e) => new UniqueConstraintException(e.message),
  },
  {
    domain: ForeignKeyConstraintError,
    toHttp: (e) => new ForeignKeyConstraintException(e.message),
  },
];

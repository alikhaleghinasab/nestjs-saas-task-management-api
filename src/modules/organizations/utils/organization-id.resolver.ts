import {
  TENANT_HEADER_NAME,
  TENANT_PARAM_NAME,
} from '@organizations/constants/tenant.constant';
import { ContextMismatchError } from '@organizations/errors/domain/context-mismatch.error';
import { FastifyRequest } from 'fastify';

export function resolveOrganizationId(req: FastifyRequest): string | undefined {
  const header = req.headers[TENANT_HEADER_NAME] as string;
  const param = req.params[TENANT_PARAM_NAME];

  if (param && header && param !== header) {
    throw new ContextMismatchError();
  }

  return param ?? header;
}

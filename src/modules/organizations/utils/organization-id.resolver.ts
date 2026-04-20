import {
  TENANT_HEADER_NAME,
  TENANT_PARAM_NAME,
} from '@organizations/constants/tenant.constant';

export function resolveOrganizationId(req): string | undefined {
  const header = req.headers[TENANT_HEADER_NAME] as string;
  const param = req.params[TENANT_PARAM_NAME];

  if (param && header && param !== header) {
    throw new Error('TENANT_MISMATCH');
  }

  return param ?? header;
}

export function withOrg<T>(where: T, orgId: string) {
  return { ...where, organizationId: orgId };
}

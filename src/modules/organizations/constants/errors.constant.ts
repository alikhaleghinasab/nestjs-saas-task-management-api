export const ORGANIZATION_ERRORS = Object.freeze({
  SLUG_EXISTS: 'Slug is already registered.',
  CONTEXT_MISSING: 'Organization context is missing from the request',
  PERMISSION_DENIED: 'You do not have the required permissions for this action',
  NOT_A_MEMBER: 'You are not a member of this organization',
} as const);

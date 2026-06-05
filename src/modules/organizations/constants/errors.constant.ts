export const ORGANIZATION_ERRORS = Object.freeze({
  SLUG_EXISTS: 'Slug is already registered.',
  CONTEXT_MISSING: 'Organization context is missing from the request',
  CONTEXT_MISMATCH:
    'The organization ID provided in the route parameters conflicts with the ID provided in the headers',
  PERMISSION_DENIED: 'You do not have the required permissions for this action',
  NOT_A_MEMBER: 'You are not a member of this organization',
  INVITATION_MISMATCH: 'The invitation does not belong to you',
  INVITATION_NOT_VALID: 'Invitation is not valid',
  INVITATION_SERVICE_UNAVAILABLE: 'Invitation service unavailable',
} as const);

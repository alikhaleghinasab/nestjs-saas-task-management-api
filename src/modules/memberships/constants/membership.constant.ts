export const getUserRoleCacheKey = (userId: string, organizationId: string) =>
  `membership:user-role-${userId}-${organizationId}`;

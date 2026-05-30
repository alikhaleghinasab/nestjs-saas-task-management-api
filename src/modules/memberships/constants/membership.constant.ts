export const getUserRoleCacheKey = (userId: string, organizationId: string) =>
  `membership:user-role-${userId}-${organizationId}`;

export const USER_ROLE_CACHE_TTL_SECONDS = 60 * 60;

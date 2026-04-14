export interface UpsertRefreshTokenParams {
  userId: string;
  tokenHash: string;
  jti: string;
  expiresAt: Date;
}

import { ConfigType, registerAs } from '@nestjs/config';

const authConfig = registerAs('auth', () => ({
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  accessTokenExpiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN ?? '900'),
  refreshTokenExpiresIn: Number(
    process.env.REFRESH_TOKEN_EXPIRES_IN ?? '604800',
  ),
}));

export default authConfig;
export type AuthConfigType = ConfigType<typeof authConfig>;

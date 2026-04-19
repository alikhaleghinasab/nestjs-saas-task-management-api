import { ConfigType, registerAs } from '@nestjs/config';

const appConfig = registerAs('app', () => ({
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  apiUrl: process.env.API_URL,
}));

export default appConfig;
export type AppConfigType = ConfigType<typeof appConfig>;

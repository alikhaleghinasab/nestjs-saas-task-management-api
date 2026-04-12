export const ALLOWED_DB_TYPES = [
  'postgres',
  'mysql',
  'mariadb',
  'sqlite',
  'mongodb',
] as const;

export type DatabaseType = (typeof ALLOWED_DB_TYPES)[number];

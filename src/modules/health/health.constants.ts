export const SERVICE_NAME = {
  DATABASE: 'database',
  REDIS: 'redis',
  RABBITMQ: 'rabbitmq',
} as const;

export const HEALTH_TIMEOUTS = {
  REDIS: 1000,
  DATABASE: 3000,
  RABBITMQ: 2000,
};

export const RABBITMQ_HEALTH_QUEUE = 'health-queue';

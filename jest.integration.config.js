const base = require('./jest.config');
const { config: dotenvConfig } = require('dotenv');

dotenvConfig({ path: '.env.test' });
dotenvConfig({ path: '.env.test.integration', override: true });

module.exports = {
  ...base,
  displayName: 'integration',
  testRegex: '.*\\.integration\\.spec\\.ts$',
  globalSetup: '<rootDir>/tests/setup/global-setup.integration.ts',
  maxWorkers: 1,
  testTimeout: 20000,
};

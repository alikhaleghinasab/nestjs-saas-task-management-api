const base = require('./jest.config');
const { config: dotenvConfig } = require('dotenv');

dotenvConfig({ path: '.env.test' });
dotenvConfig({ path: '.env.test.e2e', override: true });

module.exports = {
  ...base,
  displayName: 'e2e',
  testRegex: '.*\\.e2e\\.spec\\.ts$',
  globalSetup: '<rootDir>/tests/setup/global-setup.e2e.ts',
  maxWorkers: 1,
  testTimeout: 30000,
};

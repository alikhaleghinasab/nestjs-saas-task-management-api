'use strict';

module.exports = {
  rules: {
    // Expose our new rule so ESLint can find it.
    'require-with-org': require('./rules/require-with-org'),
  },
};

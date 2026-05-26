'use strict';

const WRAPPER_FUNCTION_NAME = 'withOrg';

const TARGET_METHODS = new Set([
  'softDelete',
  'delete',
  'update',
  'find',
  'findBy',
  'findOne',
  'findOneBy',
]);

module.exports = {
  WRAPPER_FUNCTION_NAME,
  TARGET_METHODS,
};

'use strict';

const { ESLintUtils, AST_NODE_TYPES } = require('@typescript-eslint/utils');
const { WRAPPER_FUNCTION_NAME, TARGET_METHODS } = require('../constants');

function findEnclosingClass(node) {
  let current = node.parent;
  while (current) {
    if (current.type === AST_NODE_TYPES.ClassDeclaration) {
      return current;
    }
    current = current.parent;
  }
  return null;
}

function isExtending(type, baseClassName, checker) {
  if (!type.isClass()) return false;
  const baseTypes = checker.getBaseTypes(type);
  for (const baseType of baseTypes) {
    if (baseType.getSymbol()?.getName() === baseClassName) return true;
    if (isExtending(baseType, baseClassName, checker)) return true;
  }
  return false;
}

function isWrapperCall(node) {
  return (
    node?.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.Identifier &&
    node.callee.name === WRAPPER_FUNCTION_NAME
  );
}

module.exports = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that specific repository methods are wrapped in withOrg()',
      recommended: 'error',
    },
    messages: {
      mustBeWrapped:
        "The condition argument for '{{methodName}}' on a TenantBaseRepository must be wrapped in the withOrg() utility.",
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    const services = ESLintUtils.getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;

        const methodName = node.callee.property.name;
        if (!TARGET_METHODS.has(methodName)) return;

        const enclosingClass = findEnclosingClass(node);
        if (!enclosingClass) return;

        const classTsNode = services.esTreeNodeToTSNodeMap.get(enclosingClass);
        const classType = checker.getTypeAtLocation(classTsNode);
        if (!isExtending(classType, 'TenantBaseRepository', checker)) return;

        const firstArg = node.arguments[0];

        // VALID CASE 1: The argument is a direct call to the wrapper.
        // e.g., repo.findOneBy(withOrg(...))
        if (isWrapperCall(firstArg)) {
          return;
        }

        // VALID CASE 2: The argument is an object with a `where` property
        // e.g., repo.findOne({ where: withOrg(...) })
        if (firstArg?.type === AST_NODE_TYPES.ObjectExpression) {
          const whereProperty = firstArg.properties.find(
            (prop) =>
              prop.type === AST_NODE_TYPES.Property &&
              prop.key?.name === 'where',
          );

          if (isWrapperCall(whereProperty?.value)) {
            return;
          }
        }

        context.report({
          node,
          messageId: 'mustBeWrapped',
          data: { methodName },
        });
      },
    };
  },
});

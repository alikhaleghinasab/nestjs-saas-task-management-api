import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiSuccessResponseDocs<TModel extends Type<unknown>>(
  model?: TModel | null,
  description?: string,
  status: number = 201,
  message?: string,
) {
  const hasModel = !!model;
  const hasMessage = !!message;

  return applyDecorators(
    ...(hasModel ? [ApiExtraModels(model)] : []),
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          ...(hasModel && {
            data: { $ref: getSchemaPath(model) },
          }),
          ...(hasMessage && {
            message: { type: 'string', example: message },
          }),
        },
        required: ['success', ...(hasModel ? ['data'] : [])],
      },
    }),
  );
}

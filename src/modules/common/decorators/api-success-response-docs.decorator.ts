import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

interface ApiSuccessOptions<TModel extends Type<unknown>> {
  model?: TModel;
  status?: number;
  description?: string;
  message?: string;
}

export function ApiSuccessResponseDocs<TModel extends Type<unknown>>(
  opts: ApiSuccessOptions<TModel> = {},
) {
  const { model, status = 200, description, message } = opts;

  const hasModel = Boolean(model);
  const hasMessage = Boolean(message);

  const required = [
    'success',
    ...(hasModel ? ['data'] : []),
    ...(hasMessage ? ['message'] : []),
  ];

  return applyDecorators(
    ...(hasModel ? [ApiExtraModels(model)] : []),
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          ...(hasModel && { data: { $ref: getSchemaPath(model) } }),
          ...(hasMessage && { message: { type: 'string', example: message } }),
        },
        required,
      },
    }),
  );
}

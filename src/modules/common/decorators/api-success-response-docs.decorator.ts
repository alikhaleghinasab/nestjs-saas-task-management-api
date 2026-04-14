import { ApiSuccessResponse } from '@common/responses/api-success-response.dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiSuccessResponseDocs<TModel extends Type<any>>(
  model: TModel,
  description?: string,
  status: number = 201,
) {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponse, model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiSuccessResponse) },
          {
            type: 'object',
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
            required: ['data'],
          },
        ],
      },
    }),
  );
}
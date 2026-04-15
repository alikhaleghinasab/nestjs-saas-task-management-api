import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@common/responses/api-paginated-response.dto';

interface ApiPaginatedOptions<TModel extends Type<unknown>> {
  model: TModel;
  description?: string;
}

export function ApiPaginatedResponseDocs<TModel extends Type<unknown>>(
  opts: ApiPaginatedOptions<TModel>,
) {
  const { model, description } = opts;

  return applyDecorators(
    ApiExtraModels(ApiPaginatedResponse, model),
    ApiResponse({
      status: 200,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiPaginatedResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
}

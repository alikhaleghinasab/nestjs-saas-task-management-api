import { Param, ParseUUIDPipe } from '@nestjs/common';

export function UuidParam(name: string = 'id'): ParameterDecorator {
  return Param(name, new ParseUUIDPipe());
}

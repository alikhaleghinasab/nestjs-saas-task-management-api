// src/common/decorators/auth.decorator.ts
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export function JwtAuth() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
}

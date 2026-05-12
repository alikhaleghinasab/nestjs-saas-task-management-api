import {
  BadRequestException,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { OrganizationRolesGuard } from './organization-roles.guard';
import { Roles } from '@memberships/enums/roles.enum';
import { PermissionDeniedException } from '@organizations/exceptions/permission-denied.exception';
import {
  TENANT_HEADER_NAME,
  TENANT_PARAM_NAME,
} from '@organizations/constants/tenant.constant';
import { MembershipService } from '@memberships/services/membership.service';

describe('OrganizationRolesGuard', () => {
  let guard: OrganizationRolesGuard;
  let reflector: jest.Mocked<Reflector>;
  let membershipsService: jest.Mocked<MembershipService>;

  let request: {
    user?: { id: string } | null;
    headers: Record<string, string>;
    params: Record<string, string>;
    organizationId?: string;
  };

  let context: ExecutionContext;

  const organizationId = '019d870d-a332-7c76-8ed5-b34bd82ed8a9';
  const userId = '019da64e-c94c-7d6c-ad85-a8c031774387';

  const createRequest = () => {
    return {
      user: { id: userId },
      headers: {
        [TENANT_HEADER_NAME]: organizationId,
      },
      params: {
        [TENANT_PARAM_NAME]: organizationId,
      },
    };
  };

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    membershipsService = {
      getUserRoleInOrganization: jest.fn(),
    } as unknown as jest.Mocked<MembershipService>;

    request = createRequest();

    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(() => request),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    guard = new OrganizationRolesGuard(reflector, membershipsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow access when no roles are required', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue(undefined);

    // Act & Assert
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should throw UnauthorizedException when user is missing', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Roles.Owner]);
    request.user = null;

    // Act & Assert
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should throw BadRequestException when organizationId is missing', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Roles.Owner]);
    request.headers = {};
    request.params = {};

    // Act & Assert
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should throw PermissionDeniedException when user is not a member', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Roles.Owner]);
    membershipsService.getUserRoleInOrganization.mockResolvedValue(null);

    // Act & Assert
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(PermissionDeniedException);
  });

  it('should throw PermissionDeniedException when role is insufficient', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Roles.Owner]);
    membershipsService.getUserRoleInOrganization.mockResolvedValue(Roles.Member);

    // Act & Assert
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(PermissionDeniedException);
  });

  it('should allow access when user has required role', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Roles.Owner, Roles.Member]);
    membershipsService.getUserRoleInOrganization.mockResolvedValue(Roles.Member);

    // Act & Assert
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should attach organizationId to request', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Roles.Member]);
    membershipsService.getUserRoleInOrganization.mockResolvedValue(Roles.Member);

    // Act
    await guard.canActivate(context);

    // Assert
    expect(request.organizationId).toBe(organizationId);
  });

  it('should throw BadRequestException when header and param mismatch', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Roles.Owner]);
    request.headers[TENANT_HEADER_NAME] = organizationId;
    request.params[TENANT_PARAM_NAME] = '7c9e6679-7425-40de-944b-e07fc1f90ae7';

    // Act & Assert
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should resolve organizationId from header when param is absent', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Roles.Member]);
    request.params = {};
    membershipsService.getUserRoleInOrganization.mockResolvedValue(Roles.Member);

    // Act
    await guard.canActivate(context);

    // Assert
    expect(membershipsService.getUserRoleInOrganization).toHaveBeenCalledWith(userId, organizationId);
    expect(request.organizationId).toBe(organizationId);
  });
});

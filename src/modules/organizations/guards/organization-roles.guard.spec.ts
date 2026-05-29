import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { UnauthorizedException } from '@nestjs/common';

import { OrganizationRolesGuard } from './organization-roles.guard';
import { MembershipService } from '@memberships/services/membership.service';
import { Roles } from '@memberships/enums/roles.enum';
import { PermissionDeniedException } from '@organizations/exceptions/permission-denied.exception';
import { ContextMissingException } from '@organizations/exceptions/context-missing.exception';
import { AppClsStore } from '@core/interfaces/cls-store.interface';

describe('OrganizationRolesGuard', () => {
  let guard: OrganizationRolesGuard;
  let reflector: jest.Mocked<Reflector>;
  let membershipsService: jest.Mocked<MembershipService>;
  let clsService: jest.Mocked<ClsService<AppClsStore>>;
  let context: ExecutionContext;

  const organizationId = '019d870d-a332-7c76-8ed5-b34bd82ed8a9';
  const userId = '019da64e-c94c-7d6c-ad85-a8c031774387';

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    membershipsService = {
      getUserRoleInOrganization: jest.fn(),
    } as unknown as jest.Mocked<MembershipService>;

    clsService = {
      get: jest.fn().mockImplementation((key: keyof AppClsStore) => {
        if (key === 'userId') return userId;
        if (key === 'organizationId') return organizationId;
        return undefined;
      }),
      set: jest.fn(),
    } as unknown as jest.Mocked<ClsService<AppClsStore>>;

    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    guard = new OrganizationRolesGuard(
      reflector,
      membershipsService,
      clsService,
    );
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

  it('should throw UnauthorizedException when userId is missing from CLS', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Roles.Owner]);
    clsService.get.mockImplementation((key: keyof AppClsStore) => {
      if (key === 'userId') return undefined;
      if (key === 'organizationId') return organizationId;
      return undefined;
    });

    // Act & Assert
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should throw ContextMissingException when organizationId is missing from CLS', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Roles.Owner]);
    clsService.get.mockImplementation((key: keyof AppClsStore) => {
      if (key === 'userId') return userId;
      if (key === 'organizationId') return undefined;
      return undefined;
    });

    // Act & Assert
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      ContextMissingException,
    );
  });

  it('should throw PermissionDeniedException when user is not a member of the organization', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Roles.Owner]);
    membershipsService.getUserRoleInOrganization.mockResolvedValue(null);

    // Act & Assert
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      PermissionDeniedException,
    );
  });

  it('should throw PermissionDeniedException when user role is insufficient', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Roles.Owner]);
    membershipsService.getUserRoleInOrganization.mockResolvedValue(
      Roles.Member,
    );

    // Act & Assert
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      PermissionDeniedException,
    );
  });

  it('should allow access when user has the required role', async () => {
    // Arrange
    reflector.getAllAndOverride.mockReturnValue([Roles.Owner, Roles.Member]);
    membershipsService.getUserRoleInOrganization.mockResolvedValue(
      Roles.Member,
    );

    // Act & Assert
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(membershipsService.getUserRoleInOrganization).toHaveBeenCalledWith(
      userId,
      organizationId,
    );
  });
});

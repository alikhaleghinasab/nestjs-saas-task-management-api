import { Test, TestingModule } from '@nestjs/testing';
import { MembershipService } from './membership.service';
import { MembershipRepository } from '../repositories/membership.repository';
import { CacheHelper } from '@cache/cache.helper';
import { CACHE_PROVIDER } from '@cache/cache.constant';
import { Roles } from '@memberships/enums/roles.enum';
import { UpdateMembershipRoleParams } from '../interfaces/membership-params.interface';
import { getUserRoleCacheKey } from '@memberships/constants/membership.constant';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => {},
  initializeTransactionalContext: jest.fn(),
  addTransactionalDataSource: jest.fn(),
}));

describe('MembershipService', () => {
  let service: MembershipService;
  let cacheProvider: any;
  let repository: any;

  const MOCK_USER_ID = '019e4ac6-b5ec-789d-ba95-c2c630335f33';
  const MOCK_ORG_ID = '019e4ac6-b5da-7a4f-a6a3-3a8411f33a34';

  const mockMembershipRepository = {
    create: jest.fn(),
    updateRole: jest.fn(),
    delete: jest.fn(),
    getUserRoleInOrganization: jest.fn(),
  };

  const mockCacheProvider = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        CacheHelper,
        {
          provide: MembershipRepository,
          useValue: mockMembershipRepository,
        },
        {
          provide: CACHE_PROVIDER,
          useValue: mockCacheProvider,
        },
      ],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
    cacheProvider = module.get(CACHE_PROVIDER);
    repository = module.get(MembershipRepository);

    jest.clearAllMocks();
  });

  describe('getUserRoleInOrganization (Cache Read Tests)', () => {
    const expectedRole = Roles.Admin;
    const cacheKey = getUserRoleCacheKey(MOCK_USER_ID, MOCK_ORG_ID);

    it('should fetch from repository and set cache on a cache miss', async () => {
      // Arrange
      cacheProvider.get.mockResolvedValue(null);
      repository.getUserRoleInOrganization.mockResolvedValue(expectedRole);

      // Act
      const result = await service.getUserRoleInOrganization(
        MOCK_USER_ID,
        MOCK_ORG_ID,
      );

      // Assert
      expect(result).toBe(expectedRole);
      expect(cacheProvider.get).toHaveBeenCalledWith(cacheKey);
      expect(repository.getUserRoleInOrganization).toHaveBeenCalledWith(
        MOCK_USER_ID,
        MOCK_ORG_ID,
      );
      expect(cacheProvider.set).toHaveBeenCalledWith(
        cacheKey,
        expectedRole,
        expect.any(Number),
      );
    });

    it('should fetch from cache and NOT call repository on a cache hit', async () => {
      // Arrange
      cacheProvider.get.mockResolvedValue(expectedRole);

      // Act
      const result = await service.getUserRoleInOrganization(
        MOCK_USER_ID,
        MOCK_ORG_ID,
      );

      // Assert
      expect(result).toBe(expectedRole);
      expect(cacheProvider.get).toHaveBeenCalledWith(cacheKey);
      expect(repository.getUserRoleInOrganization).not.toHaveBeenCalled();
      expect(cacheProvider.set).not.toHaveBeenCalled();
    });
  });

  describe('updateRole (Cache Invalidation Tests)', () => {
    const updateParams: UpdateMembershipRoleParams = {
      userId: MOCK_USER_ID,
      organizationId: MOCK_ORG_ID,
      role: Roles.Member,
    };
    const expectedCacheKey = getUserRoleCacheKey(MOCK_USER_ID, MOCK_ORG_ID);

    it('should invalidate the cache on a successful role update', async () => {
      // Arrange
      repository.updateRole.mockResolvedValue(true);

      // Act
      const result = await service.updateRole(updateParams);

      // Assert
      expect(result).toBe(true);
      expect(repository.updateRole).toHaveBeenCalledWith(updateParams);
      expect(cacheProvider.del).toHaveBeenCalledWith(expectedCacheKey);
    });
  });

  describe('delete (Cache Invalidation Tests)', () => {
    const expectedCacheKey = getUserRoleCacheKey(MOCK_USER_ID, MOCK_ORG_ID);

    it('should invalidate the cache on a successful membership deletion', async () => {
      // Arrange
      repository.delete.mockResolvedValue(true);

      // Act
      const result = await service.delete(MOCK_USER_ID, MOCK_ORG_ID);

      // Assert
      expect(result).toBe(true);
      expect(repository.delete).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_ORG_ID);
      expect(cacheProvider.del).toHaveBeenCalledWith(expectedCacheKey);
    });
  });
});

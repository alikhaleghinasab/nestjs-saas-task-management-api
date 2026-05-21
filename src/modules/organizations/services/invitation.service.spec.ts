import { InvitationService } from './invitation.service';
import { InvitationRepository } from '@organizations/repositories/invitation.repository';
import { OrganizationPublisher } from '@organizations/messaging/pulishers/organization.publisher';
import { MembershipService } from '@memberships/services/membership.service';
import { InviteUserDto } from '@organizations/dto/invite-user.dto';
import { Invitation } from '@organizations/entities/invitation.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { Roles } from '@memberships/enums/roles.enum';

describe('InvitationService', () => {
  let service: InvitationService;
  let invitationRepository: jest.Mocked<InvitationRepository>;
  let organizationPublisher: jest.Mocked<OrganizationPublisher>;

  const ORGANIZATION_ID = '019d968e-f56b-79ab-bf13-9fb5b0c21b55';
  const INVITATION_ID = '019d9868-b04f-7d78-a845-a8d8a1c2bfdc';
  const INVITATION_TOKEN = '019d9af5-86d2-78a3-a563-e88aa596106c';

  const dto: InviteUserDto = {
    email: 'member@test.com',
    role: Roles.Member,
  };

  const invitation: Invitation = {
    id: INVITATION_ID,
    email: dto.email,
    role: dto.role,
    organizationId: ORGANIZATION_ID,
    invitationToken: INVITATION_TOKEN,
  } as Invitation;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationService,
        {
          provide: InvitationRepository,
          useValue: { create: jest.fn() },
        },
        {
          provide: OrganizationPublisher,
          useValue: { userInvited: jest.fn() },
        },
        {
          provide: MembershipService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<InvitationService>(InvitationService);
    invitationRepository = module.get(InvitationRepository);
    organizationPublisher = module.get(OrganizationPublisher);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('inviteUser', () => {
    it('should create invitation and publish user invited event', async () => {
      // Arrange
      invitationRepository.create.mockResolvedValue(invitation);
      organizationPublisher.userInvited.mockResolvedValue();

      // Act
      const result = await service.inviteUser(dto, ORGANIZATION_ID);

      // Assert
      expect(result).toEqual(invitation);
      expect(invitationRepository.create).toHaveBeenCalledWith({
        ...dto,
        invitationToken: expect.any(String),
        organizationId: ORGANIZATION_ID,
      });
      expect(organizationPublisher.userInvited).toHaveBeenCalledTimes(1);
      expect(organizationPublisher.userInvited).toHaveBeenCalledWith({
        email: dto.email,
        invitationToken: INVITATION_TOKEN,
      });
    });

    it('should not publish event when invitation creation fails', async () => {
      // Arrange
      invitationRepository.create.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(service.inviteUser(dto, ORGANIZATION_ID)).rejects.toThrow(
        'Database error',
      );
      expect(organizationPublisher.userInvited).not.toHaveBeenCalled();
    });
  });
});

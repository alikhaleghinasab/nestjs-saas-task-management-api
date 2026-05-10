import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '@users/services/user.service';
import { ConfigService } from '@nestjs/config';
import { BcryptHasher } from '@common/security/bcrypt-hasher.service';
import { RefreshTokenService } from './refresh-token.service';
import { RegisterDto } from '../dto/register.dto';
import { User } from '@users/entities/user.entity';

// Mock the Transactional decorator to do nothing
jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => {},
  initializeTransactionalContext: jest.fn(),
  addTransactionalDataSource: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  let userService: jest.Mocked<UserService>;
  let bcryptHasher: jest.Mocked<BcryptHasher>;
  let refreshTokenService: jest.Mocked<RefreshTokenService>;
  let configService: jest.Mocked<ConfigService>;

  const dto: RegisterDto = {
    email: 'john@example.com',
    password: 'plain-password',
    firstName: 'John',
    lastName: 'Doe',
  };

  const hashedPassword = 'hashed-password';

  const createdUser: Partial<User> = {
    id: 'user-id',
    email: dto.email,
  };

  const tokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  const arrangeSuccess = () => {
    bcryptHasher.hash.mockResolvedValue(hashedPassword);
    userService.createUser.mockResolvedValue(createdUser as User);
    refreshTokenService.generateTokens.mockResolvedValue(tokens);
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
          },
        },
        {
          provide: BcryptHasher,
          useValue: {
            hash: jest.fn(),
          },
        },
        {
          provide: RefreshTokenService,
          useValue: {
            generateTokens: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userService = module.get(UserService);
    bcryptHasher = module.get(BcryptHasher);
    refreshTokenService = module.get(RefreshTokenService);
    configService = module.get(ConfigService);

    configService.get.mockReturnValue({ saltRounds: 10 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should hash password before creating user', async () => {
      arrangeSuccess();

      await service.register(dto);

      expect(bcryptHasher.hash).toHaveBeenCalledWith(dto.password, 10);
    });

    it('should persist user with hashed password', async () => {
      arrangeSuccess();

      await service.register(dto);

      expect(userService.createUser).toHaveBeenCalledWith({
        ...dto,
        password: hashedPassword,
      });
    });

    it('should generate tokens using created user id', async () => {
      arrangeSuccess();

      await service.register(dto);

      expect(refreshTokenService.generateTokens).toHaveBeenCalledWith(
        createdUser.id,
      );
    });

    it('should return generated tokens', async () => {
      arrangeSuccess();

      await expect(service.register(dto)).resolves.toEqual(tokens);
    });
  });
});

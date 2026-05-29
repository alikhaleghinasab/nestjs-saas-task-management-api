import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '@users/services/user.service';
import { RefreshTokenService } from './refresh-token.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '@auth/dto/login.dto';
import { User } from '@users/entities/user.entity';
import { ForbiddenException } from '@nestjs/common';
import { InvalidCredentialsException } from '@auth/exceptions/auth.exception';
import { ArgonHasher } from '@common/security/argon-hasher.service';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => {},
  initializeTransactionalContext: jest.fn(),
  addTransactionalDataSource: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  let userService: jest.Mocked<UserService>;
  let argonHasher: jest.Mocked<ArgonHasher>;
  let refreshTokenService: jest.Mocked<RefreshTokenService>;

  const registerDto: RegisterDto = {
    email: 'john@example.com',
    password: 'plain-password',
    firstName: 'John',
    lastName: 'Doe',
  };

  const loginDto: LoginDto = {
    email: registerDto.email,
    password: registerDto.password,
  };

  const hashedPassword = 'hashed-password';

  const createdUser: Partial<User> = {
    id: 'user-id',
    email: registerDto.email,
  };

  const existingUser: Partial<User> = {
    id: 'user-id',
    email: registerDto.email,
    password: hashedPassword,
    isActive: true,
  };

  const tokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            findUserForAuth: jest.fn(),
          },
        },
        {
          provide: ArgonHasher,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
          },
        },
        {
          provide: RefreshTokenService,
          useValue: {
            issueTokens: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userService = module.get(UserService);
    argonHasher = module.get(ArgonHasher);
    refreshTokenService = module.get(RefreshTokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a user and return tokens', async () => {
      // Arrange
      argonHasher.hash.mockResolvedValue(hashedPassword);
      userService.createUser.mockResolvedValue(createdUser as User);
      refreshTokenService.issueTokens.mockResolvedValue(tokens);

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(argonHasher.hash).toHaveBeenCalledWith(registerDto.password);
      expect(userService.createUser).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
      expect(refreshTokenService.issueTokens).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(tokens);
    });
  });

  describe('login', () => {
    it('should successfully login and return tokens', async () => {
      // Arrange
      userService.findUserForAuth.mockResolvedValue(existingUser as User);
      argonHasher.compare.mockResolvedValue(true);
      refreshTokenService.issueTokens.mockResolvedValue(tokens);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(userService.findUserForAuth).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(argonHasher.compare).toHaveBeenCalledWith(
        loginDto.password,
        hashedPassword,
      );
      expect(refreshTokenService.issueTokens).toHaveBeenCalledWith(
        existingUser,
      );
      expect(result).toEqual(tokens);
    });

    it('should throw if user not found', async () => {
      // Arrange
      userService.findUserForAuth.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        InvalidCredentialsException,
      );
    });

    it('should throw ForbiddenException if user is inactive', async () => {
      // Arrange
      userService.findUserForAuth.mockResolvedValue({
        ...existingUser,
        isActive: false,
      } as User);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw InvalidCredentialsException on wrong password', async () => {
      // Arrange
      userService.findUserForAuth.mockResolvedValue(existingUser as User);
      argonHasher.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        InvalidCredentialsException,
      );
    });
  });
});

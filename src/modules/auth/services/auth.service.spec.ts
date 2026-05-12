import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '@users/services/user.service';
import { ConfigService } from '@nestjs/config';
import { BcryptHasher } from '@common/security/bcrypt-hasher.service';
import { RefreshTokenService } from './refresh-token.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '@auth/dto/login.dto';
import { User } from '@users/entities/user.entity';
import { ForbiddenException } from '@nestjs/common';
import { InvalidCredentialsException } from '@auth/exceptions/auth.exception';

// Mock Transactional decorator
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

  const arrangeRegisterSuccess = () => {
    bcryptHasher.hash.mockResolvedValue(hashedPassword);
    userService.createUser.mockResolvedValue(createdUser as User);
    refreshTokenService.generateTokens.mockResolvedValue(tokens);
  };

  const arrangeLoginSuccess = () => {
    userService.findUserForAuth.mockResolvedValue(existingUser as User);
    bcryptHasher.compare.mockResolvedValue(true);
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
            findUserForAuth: jest.fn(),
          },
        },
        {
          provide: BcryptHasher,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
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
      arrangeRegisterSuccess();

      await service.register(registerDto);

      expect(bcryptHasher.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('should persist user with hashed password', async () => {
      arrangeRegisterSuccess();

      await service.register(registerDto);

      expect(userService.createUser).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
    });

    it('should generate tokens using created user id', async () => {
      arrangeRegisterSuccess();

      await service.register(registerDto);

      expect(refreshTokenService.generateTokens).toHaveBeenCalledWith(
        createdUser.id,
      );
    });

    it('should return generated tokens', async () => {
      arrangeRegisterSuccess();

      await expect(service.register(registerDto)).resolves.toEqual(tokens);
    });
  });

  describe('login', () => {
    it('should fetch user by email', async () => {
      arrangeLoginSuccess();

      await service.login(loginDto);

      expect(userService.findUserForAuth).toHaveBeenCalledWith({
        email: loginDto.email,
      });
    });

    it('should throw if user not found', async () => {
      userService.findUserForAuth.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        InvalidCredentialsException,
      );
    });

    it('should throw ForbiddenException if user is inactive', async () => {
      userService.findUserForAuth.mockResolvedValue({
        ...existingUser,
        isActive: false,
      } as User);

      await expect(service.login(loginDto)).rejects.toThrow(ForbiddenException);
    });

    it('should validate password using bcrypt', async () => {
      arrangeLoginSuccess();

      await service.login(loginDto);

      expect(bcryptHasher.compare).toHaveBeenCalledWith(
        loginDto.password,
        hashedPassword,
      );
    });

    it('should throw InvalidCredentialsException on wrong password', async () => {
      userService.findUserForAuth.mockResolvedValue(existingUser as User);
      bcryptHasher.compare.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        InvalidCredentialsException,
      );
    });

    it('should generate tokens when login is valid', async () => {
      arrangeLoginSuccess();

      await service.login(loginDto);

      expect(refreshTokenService.generateTokens).toHaveBeenCalledWith(
        existingUser.id,
      );
    });

    it('should return tokens on successful login', async () => {
      arrangeLoginSuccess();

      await expect(service.login(loginDto)).resolves.toEqual(tokens);
    });

    it('should NOT generate tokens when login fails', async () => {
      userService.findUserForAuth.mockResolvedValue(null);

      try {
        await service.login(loginDto);
      } catch (e) {}

      expect(refreshTokenService.generateTokens).not.toHaveBeenCalled();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, UserLogin } from './schemas';

describe('AuthController', () => {
  let controller: AuthController;
  const mockToken = 'mock token';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: {},
        },
        { provide: JwtService, useValue: {} },
        {
          provide: AuthService,
          useValue: {
            signUp: async (dto: CreateUserDto) => {
              return { id: 1, email: dto.email };
            },
            signIn: async (
              credentials: UserLogin,
            ): Promise<{ email: string; token: string; schemas: any }> => {
              return {
                email: credentials.email,
                token: mockToken,
                schemas: {},
              };
            },
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const user = {
    email: 'user@mail.com',
    password: 'password',
  };
  describe('sign up', () => {
    it('should return the created user', async () => {
      const response = await controller.signUp(user);
      expect(response).toEqual({ email: user.email, id: 1 });
    });
  });

  describe('sign in', () => {
    it('should return the user token and schemas', async () => {
      const response = await controller.signIn(user);
      expect(response).toEqual({
        email: user.email,
        token: mockToken,
        schemas: {},
      });
    });
  });
});

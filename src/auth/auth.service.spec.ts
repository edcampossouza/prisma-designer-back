import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto, UserLogin } from './schemas';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  const userDb: User[] = [
    { email: 'user1@mail.com', id: 1, password: '123' },
    { email: 'user2@mail.com', id: 2, password: '321' },
  ];
  const schemaDb = [
    { mail: 'user1@mail.com', id: 1, name: 'one' },
    { mail: 'user2@mail.com', id: 2, name: 'two' },
    { mail: 'user1@mail.com', id: 3, name: 'three' },
  ];
  const mockToken = 'mock token';
  const userServiceMock: Omit<UsersService, 'prisma'> = {
    createUser: async function (createUserDto: CreateUserDto): Promise<User> {
      if (userDb.find((u) => u.email === createUserDto.email))
        throw new ConflictException('');
      const id = userDb.length + 1;
      userDb.push({ ...createUserDto, id });
      return userDb[userDb.length - 1];
    },
    getusers: async function (): Promise<User[]> {
      return userDb;
    },
    getUserByEmail: async function (
      email: string,
    ): Promise<User & { Schema: { name: string; id: number }[] }> {
      const user = userDb.find((u) => u.email === email);
      if (!user) return;
      const schemas = schemaDb.filter((s) => s.mail === email);
      return { ...user, Schema: schemas };
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: async (data: any): Promise<string> => {
              return mockToken;
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and return user', async () => {
    const userDto: CreateUserDto = { email: 'user@mail.com', password: '123' };
    const created = await service.signUp(userDto);
    expect(created).toEqual({ email: userDto.email, id: expect.any(Number) });
  });

  it('should fail for wrong password', async () => {
    const wrongPassword: UserLogin = {
      email: 'user1@mail.com',
      password: '321',
    };
    const wrongEmail: UserLogin = { email: 'userX@mail.com', password: '123' };

    const wrongPassProm = service.signIn(wrongPassword);
    const wrongEmailProm = service.signIn(wrongEmail);

    await expect(wrongPassProm).rejects.toEqual(
      expect.any(UnauthorizedException),
    );
    await expect(wrongEmailProm).rejects.toEqual(
      expect.any(UnauthorizedException),
    );
  });

  it('should succeed for correct password', async () => {
    const mockCompare = jest
      .spyOn(bcrypt, 'compareSync')
      .mockImplementation((data: string, encrypted: string) => {
        return data === encrypted;
      });
    const correctCredentials: UserLogin = {
      email: 'user1@mail.com',
      password: '123',
    };

    const response = await service.signIn(correctCredentials);
    expect(mockCompare).toHaveBeenCalled();
    expect(response).toEqual({
      email: correctCredentials.email,
      token: mockToken,
      schemas: schemaDb.filter((s) => s.mail === correctCredentials.email),
    });
  });
});

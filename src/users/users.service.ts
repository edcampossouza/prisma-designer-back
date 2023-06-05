import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/auth/schemas';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.getUserByEmail(email);
    if (!user) {
      const hashed = await bcrypt.hash(password, 10);
      return this.prisma.user.create({
        data: { email, password: hashed },
      });
    } else throw new ConflictException('email already in use');
  }

  async getusers() {
    return await this.prisma.user.findMany({});
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}

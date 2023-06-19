import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UserLogin } from './schemas';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async getallUsers() {
    return await this.userService.getusers();
  }

  async signUp(createUserDto: CreateUserDto) {
    const { password, ...user } = await this.userService.createUser(
      createUserDto,
    );
    return user;
  }

  async signIn(credentials: UserLogin) {
    const { email, password: pass } = credentials;
    const user = await this.userService.getUserByEmail(email);
    if (!user || !bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, email: user.email };

    return {
      email: user.email,
      token: await this.jwtService.signAsync(payload),
    };
  }
}

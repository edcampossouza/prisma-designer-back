import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './schemas';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async getallUsers() {
    return await this.userService.getusers();
  }

  async signUp(createUserDto: CreateUserDto) {
    const { password, ...user } = await this.userService.createUser(
      createUserDto,
    );
    return user;
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UserLogin } from './schemas';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signUp(createUserDto);
    return user;
  }

  @Post('sign-in')
  async signIn(@Body() credentials: UserLogin) {
    const result = await this.authService.signIn(credentials);
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() request) {
    return request.user;
  }
}

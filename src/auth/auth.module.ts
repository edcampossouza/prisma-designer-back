import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtConstants } from './constants';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.jwtSecret,
      signOptions: jwtConstants.signOptions,
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}

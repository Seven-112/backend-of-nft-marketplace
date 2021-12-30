import {
  Body,
  ConflictException,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  Controller,
  Get,
  Req,
  UsePipes,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/register.dto';
import { UsersService } from 'src/modules/users/users.service';
import { RequestWithUser, User } from 'src/modules/users/users.interface';
import { Public } from 'src/guard/jwt-auth.guard';
import { LoginDTO } from './DTO/login.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @UsePipes(new ValidationPipe())
  async register(@Body() body: RegisterDTO) {
    try {
      const isUsernameAvailable = await this.usersService.isUsernameAvailable(
        body.username,
      );
      if (!isUsernameAvailable) {
        throw new ConflictException('Username is not available');
      }
      const isEmailAvailable = await this.usersService.isEmailAvailable(
        body.email,
      );
      if (!isEmailAvailable) {
        throw new ConflictException('Email is not available');
      }
      const user = new User();
      Object.assign(user, body);
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(body.password, salt);
      return this.usersService.create(user);
    } catch (error) {
      throw error;
    }
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @Public()
  @UsePipes(new ValidationPipe())
  async login(@Body() body: LoginDTO) {
    try {
      const user = await this.usersService.getUserByEmail(body.email);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      const isValidPassword = await bcrypt.compare(
        body.password,
        user.password,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid password');
      }
      return this.authService.login(user);
    } catch (error) {
      throw error;
    }
  }

  @Get('/isAuthenticated')
  @HttpCode(HttpStatus.OK)
  async isAuthenticated(@Req() req: RequestWithUser) {
    try {
      return req.user;
    } catch (error) {
      throw error;
    }
  }
}

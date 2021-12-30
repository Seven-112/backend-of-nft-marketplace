import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/register.dto';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/modules/users/users.interface';
import { Public } from 'src/guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async register(@Body() body: RegisterDTO) {
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

    return this.usersService.create(user);
  }

  @Get('/all')
  @Public()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.usersService.findAll();
  }
}

import { Body, Controller, Get, Req } from '@nestjs/common';
import { Public } from 'src/guard/jwt-auth.guard';

import { RequestWithUser } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/profile')
  async getProfile(@Req() req: RequestWithUser) {
    Reflect.deleteProperty(req.user, 'password');
    return req.user;
  }
}

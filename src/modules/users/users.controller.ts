import { Controller, Get, Req } from '@nestjs/common';

import { RequestWithUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor() {}

  @Get('/profile')
  async getMe(@Req() req: RequestWithUser) {
    Reflect.deleteProperty(req.user, 'password');
    return req.user;
  }
}

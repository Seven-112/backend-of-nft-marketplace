import { Controller, Get, Req } from '@nestjs/common';

import { RequestWithUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor() {}

  @Get('/me')
  async getMe(@Req() req: RequestWithUser) {
    return req.user;
  }
}

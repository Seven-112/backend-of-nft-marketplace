import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Auth } from 'aws-amplify';
import { JwtAuthGuard, Public } from 'src/guard/jwt-auth.guard';
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

  @Public()
  @Get('/hello')
  async hello() {
    const response = await Auth.signIn('sample@gmail.com', 'jickye103');

    return response;
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/modules/user/user.interface';
import { UserService } from '../modules/user/user.service';
import { JwtPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // const user = await this.usersService.findOne(username);
    // if (user && user.password === pass) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    // return null;
    return true;
  }

  async login(user: User) {
    const payload: JwtPayload = { email: user.email, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

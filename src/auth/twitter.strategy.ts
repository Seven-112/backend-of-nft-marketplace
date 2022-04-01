import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-twitter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class TwitterOauthStrategy extends PassportStrategy(
  Strategy,
  'twitter',
) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      consumerKey: 'F3BRj1PKbGnPSMTZAnltTLCkg',
      consumerSecret: 'BYG2DKa9otjVWFtwxUXPjxYILzi9f8IIOAew7neLTof44DQezL',
      callbackURL: '/v1/auth/twitter/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      accessToken,
      refreshToken,
      profile,
    };
  }
}

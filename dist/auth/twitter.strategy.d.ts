import { Profile, Strategy } from 'passport-twitter';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
declare const TwitterOauthStrategy_base: new (...args: any[]) => Strategy;
export declare class TwitterOauthStrategy extends TwitterOauthStrategy_base {
    private readonly userService;
    constructor(configService: ConfigService, userService: UserService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<{
        accessToken: string;
        refreshToken: string;
        profile: Profile;
    }>;
}
export {};

import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/register.dto';
import { UserService } from 'src/modules/user/user.service';
import { LoginDTO } from './DTO/login.dto';
import { MailService } from 'src/modules/mail/mail.service';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly mailService;
    constructor(authService: AuthService, userService: UserService, mailService: MailService);
    register(body: RegisterDTO): Promise<{
        code: HttpStatus;
        message: string;
    }>;
    login(body: LoginDTO): Promise<{
        code: HttpStatus;
        accessToken: any;
    }>;
    twitterAuth(): Promise<void>;
    twitterGuardRedirect(req: any): Promise<void>;
}

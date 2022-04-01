import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/register.dto';
import { UserService } from 'src/modules/user/user.service';
import { LoginDTO } from './DTO/login.dto';
import { MailService } from 'src/modules/mail/mail.service';
import { CheckCanLoginDTO } from './DTO/check-can-login.DTO';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly mailService;
    constructor(authService: AuthService, userService: UserService, mailService: MailService);
    canLogin(body: CheckCanLoginDTO): Promise<{
        code: number;
        message: string;
        data: boolean;
    }>;
    register(body: RegisterDTO): Promise<{
        code: HttpStatus;
        message: string;
    }>;
    login(body: LoginDTO): Promise<{
        code: HttpStatus;
        accessToken: any;
    }>;
}

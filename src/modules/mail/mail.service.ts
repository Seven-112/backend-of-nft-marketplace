import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/user.interface';
import * as crypto from 'crypto';
import { SECRET } from 'src/utils/constants';
import * as moment from 'moment';

const ALGORITHM = 'aes-256-cbc';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendForgotPasswordEmail(user: User) {
    const token = this.generateResetPasswordToken(user);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Forgot password email',
      text: 'Sample email',
      html: `Token here ${token}`,
    });
  }

  generateResetPasswordToken(user: User) {
    const now = new Date();

    const timeBase64 = Buffer.from(now.toISOString()).toString('base64');
    const userIdBase64 = Buffer.from(user.id).toString('base64');
    const userString = `${user.id}${user.email}${user.password}${user.updatedAt}`;
    const hash = crypto.createHash('md5').update(userString).digest('hex');

    const token = `${timeBase64}-${hash}-${userIdBase64}`;

    return this.encryptToken(token);
  }

  encryptToken(token: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET, iv);
    let encrypted = cipher.update(token);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decryptToken(token: string) {
    const [iv, _token] = token.split(':');

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      SECRET,
      Buffer.from(iv, 'hex'),
    );

    let decrypted = decipher.update(Buffer.from(_token, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  async validateToken(user: User, token: string) {
    const [timeHash64, hash] = token.split('-');
    const timestamp = Buffer.from(timeHash64, 'base64').toString('ascii');

    const tokenTimestamp = moment(timestamp);
    const now = moment();

    const diff = now.diff(tokenTimestamp, 'hours');
    if (Math.abs(diff) > 24) {
      return false;
    }

    const userString = `${user.id}${user.email}${user.password}${user.updatedAt}`;
    const userStringHash = crypto
      .createHash('md5')
      .update(userString)
      .digest('hex');

    return hash === userStringHash;
  }
}

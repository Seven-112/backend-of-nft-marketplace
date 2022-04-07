import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, Public } from 'src/guard/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { SubscribeDTO } from './DTO/subscribe.dto';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './subscription.interface';
import { MailService } from '../mail/mail.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly mailService: MailService
  ) {}

  @Post('/subscribe')
  @Public()
  @UsePipes(new ValidationPipe())
  async subscribe(@Req() request: any, @Body() body: SubscribeDTO) {
    let subscription = new Subscription();
    subscription.email = body.email;
    subscription = await this.subscriptionService.create(subscription);
    
    const content = `
      Dear sir,<br>
      Thanks for your subscribe our system.<br>
      You will receive new letter from us when have new updated on Metaverse Solana System.<br>
      For unsubscribe. Please click at <a href="http://192.248.168.248/unsubscribe/${subscription.id}">here</a><br>

      <i>This is automatic email. Please don't reply this email.</i>
      Best regards,<br>
      Metaserse Solana
    `

    const subject = `Subscribe successfully`

    this.mailService.sendEmail(subscription.email, subject, content);
    return {
      code: 201,
      message: 'subscribe_successfully',
    };
  }

  @Post('/unsubscribe/:id')
  @Public()
  @UsePipes(new ValidationPipe())
  async unsubscribe(@Req() request: any, @Param('id') id: string) {
    const subscription = await this.subscriptionService.getSubscriptionDetail(id)
    if(subscription) {
      await this.subscriptionService.delete(id);
      const content = `
        Dear sir,<br>
        Your unsubscribe Metaverse Solana system succssfully.<br>
        Best regards,<br>
        Metaserse Solana
      `

      const subject = `Unsubscribe successfully`

      this.mailService.sendEmail(subscription.email, subject, content);
    }
    
    return {
      code: 200,
      message: 'unsubscribe_successfully',
    };
  }
}

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
import { CreateSupportDTO } from './DTO/createSupport.dto';
import { SupportService } from './support.service';
import { Status, Support } from './support.interface';
import { MailService } from '../mail/mail.service';

@Controller('supports')
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
    private readonly mailService: MailService
  ) {}

  @Post('/')
  @Public()
  @UsePipes(new ValidationPipe())
  async createEvent(@Req() request: any, @Body() body: CreateSupportDTO) {
    let support = new Support();
    Object.assign(support, body);
    support.ticket_uuid = uuidv4();
    support.status = Status.open;
    support.timestamp = new Date().getTime();
    support = await this.supportService.create(support);
    
    const content = `
      Dear sir,<br>
      Thank for your support ticket request. <br><br>
      We will response in 2, 3 days in working days via your email. <br>
      Your support request information as bellow: <br>
      Ticket Id: <b>${support.ticket_uuid}</b><br>
      Subject: <b>${support.subject}</b><br>
      Description: <b>${support.description}</b><br>
      Category: <b>${support.category}</b><br>
      Blockchain: <b>${support.blockchain}</b><br>
      Transaction hash: <b>${support.transaction_hash}</b><br>
      Wallet: <b>${support.wallet}</b><br>
      <br><br>
      Best regards,<br>
      Support team
    `

    const subject = `[Support submitted] ${support.subject}`

    this.mailService.sendEmail(support.email, subject, content);
    return {
      code: 201,
      message: 'support_created',
      data: support,
    };
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getSupports(@Req() request: any, @Query('limit') limit?: number, @Query('lastItem') lastItem?: string) {

    const supports = await this.supportService.get(limit, lastItem ? { id: lastItem } : null);
    
    return {
      code: 200,
      message: 'success',
      data: supports,
    };
  }
}

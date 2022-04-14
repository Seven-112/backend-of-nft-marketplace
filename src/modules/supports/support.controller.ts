import { APP_URI } from './../../utils/constants';
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
import { Reply, Status, Support } from './support.interface';
import { MailService } from '../mail/mail.service';
import { ReplySupportDTO } from './DTO/replySupport.dto';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/user.interface';

@Controller('supports')
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
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
      You can see your support request at <a href="${process.env.APP_URI}/support/${support.ticket_uuid}">here</a>
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

    let supports = await (await this.supportService.get(limit, lastItem ? { id: lastItem } : null))['toJSON']();
    const userIds = [];
    supports.forEach((support: any) => {
      if(support.replies) {
        support.replies.forEach((reply: any) => {
          if(reply.user) {
            userIds.push(reply.user)
          }
        })
      }
    })

    const users = await this.userService.getUsers(userIds);
    supports = supports.map((support: any) => {
      if(support.replies) {
        support.replies = support.replies.map((reply: any) => {
          if(reply.user) {
            const user = users.find(user => user.id === reply.user);
            reply.username = user?.username || reply.username;
            reply.email = user?.email || reply.eamil;
          }
          return reply;
        })
      }
      return support;
    })

    return {
      code: 200,
      message: 'success',
      data: supports,
    };
  }

  @Post('/:ticket/admin/reply')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async adminReply(@Req() request: any, @Param('ticket') ticket: string, @Body() body: ReplySupportDTO) {
    const user = await this.userService.getUserById(request.user.sub);

    if(!user || user.role !== UserRole.Admin) {
      return {
        code: 400,
        message: 'user_not_permission',
        data: null
      }
    }

    const support = await this.supportService.getSupportByTicket(ticket);

    if(!support) {
      return {
        code: 400,
        message: 'support_request_not_exited',
        data: null
      }
    }

    const replies = support.replies || [];
    let reply = new Reply();
    Object.assign(reply, body);
    reply.user = user.id;
    reply.timestamp = new Date().getTime();
    reply = JSON.parse(JSON.stringify(reply));
    replies.push(reply);
    support.replies = replies;
    
    await this.supportService.updateSupport({ table: support.table, timestamp: support.timestamp }, support);
    const subject = `[Reply] ${support.subject}`
    const content = `
      Dear sir,<br>
      Your support request information as bellow: <br>
      Ticket Id: <b>${support.ticket_uuid}</b><br>
      Subject: <b>${support.subject}</b><br>
      Description: <b>${support.description}</b><br>
      Category: <b>${support.category}</b><br>
      Blockchain: <b>${support.blockchain}</b><br>
      Transaction hash: <b>${support.transaction_hash}</b><br>
      Wallet: <b>${support.wallet}</b><br>
      You can see your support request at <a href="${process.env.APP_URI}/support/${support.ticket_uuid}">here</a><br>
      ----------------------<br>
      ----------------------<br>
      [Reply]
      <p style="white-space: break-all;">
        ${reply.content}
      </p>
      <br><br>
      Best regards,<br>
      Support team<br>
      ${user.username}
    `
    console.log(support.email, subject)
    await this.mailService.sendEmail(support.email, subject, content);
    return {
      code: 200,
      message: 'success',
      data: null,
    };
  }
  
  @Post('/:ticket/user/reply')
  @Public()
  async userReply(@Req() request: any, @Param('ticket') ticket: string, @Body() body: ReplySupportDTO) {

    const support = await this.supportService.getSupportByTicket(ticket);

    if(!support) {
      return {
        code: 400,
        message: 'support_request_not_exited',
        data: null
      }
    }

    const replies = support.replies || [];
    let reply = new Reply();
    Object.assign(reply, body);
    reply.username= support.email;
    reply.email = support.email;
    reply.timestamp = new Date().getTime();
    reply = JSON.parse(JSON.stringify(reply));
    replies.push(reply);
    support.replies = replies;
    
    await this.supportService.updateSupport({ table: support.table, timestamp: support.timestamp }, support);

    return {
      code: 200,
      message: 'success',
      data: null,
    };
  }
  
}

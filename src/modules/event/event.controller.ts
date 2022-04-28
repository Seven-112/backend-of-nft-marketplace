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
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, Public } from 'src/guard/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UserRole } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { CreateEventDTO, UpdateEventDTO } from './DTO/create-event.dto';
import { BuyTicketDTO } from './DTO/buyTicket.dto';
import { Event, Ticket } from './event.interface';
import { EventService } from './event.service';
import { UserTicket } from './userTicket.interface';
import * as moment from 'moment';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) {}

  @Post('/create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createEvent(@Req() request: any, @Body() body: CreateEventDTO) {
    const ticket = new Ticket();
    Object.assign(ticket, body.ticket);
    ticket.saleStart = new Date(body.ticket.saleStart);
    ticket.saleEnd = new Date(body.ticket.saleEnd);
    ticket.remain = body.ticket.quantity;

    const event = new Event();
    Object.assign(event, body);
    event.user = request.user.sub;
    event.startDate = new Date(body.startDate);
    event.endDate = new Date(body.endDate);
    event.publishDate = new Date(body.publishDate);
    event.timestamp = new Date().getTime();
    event.createdAt = new Date().getTime();
    event.updatedAt = new Date().getTime();
    event.ticket = { ...ticket };

    const newEvent = await this.eventService.createEvent(event);
    return {
      code: 201,
      message: 'Event created',
      data: newEvent,
    };
  }

  @Patch('/update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateEvent(@Req() request: any, @Body() body: UpdateEventDTO) {
    const user = await this.userService.getUserById(request.user.sub);
    const foundEvent = await this.eventService.getEventById(body.id);

    if (!user)
      return {
        code: 404,
        message: 'User not found',
        data: null,
      };

    if (user.role !== UserRole.Admin)
      return {
        code: 403,
        message: 'Not allowed',
        data: null,
      };

    if (!foundEvent)
      return {
        code: 404,
        message: 'Event not found',
      };

    const { id } = body;

    delete body.id;

    const updateBody = {
      ...body,
      publishDate: new Date(body.publishDate),
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      createdAt: new Date(body.createdAt),
      ticket: {
        ...body.ticket,
        saleStart: new Date(body.ticket.saleStart),
        saleEnd: new Date(body.ticket.saleEnd),
      },
    };

    const updatedEvent = await this.eventService.updateEvent({
      table: foundEvent.table,
      timestamp: foundEvent.timestamp
    }, updateBody);

    return {
      code: 201,
      message: 'Event updated',
      data: updatedEvent,
    };
  }

  @Get('/')
  @Public()
  async getEvents(@Query('limit') limit?: number) {
    let events = await this.eventService.getAllEvents(limit);
    
    if(!events.length) {
      return {
        code: 200,
        message: '',
        data: { events, length: events.length },
      };
    }
    events = await events['populate']();
    const eventIds = events.map(event => event.id);

    const boughtTicketUsers = await (await this.eventService.getUserTicketByEventIds(eventIds))['populate']();
    events = events.map(event => {
      event.boughtTicketUsers = [];
      boughtTicketUsers.forEach(boughtTicketUser => {
        if(boughtTicketUser.event === event.id) {
          event.boughtTicketUsers.push(boughtTicketUser.user);
        }
      });
      return event;
    })

    return {
      code: 200,
      message: '',
      data: { events, length: events.length },
    };
    
  }

  @Get('/analysis')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Public()
  async getEventAnalisys(@Req() request: any) {
    // const user = await this.userService.getUserById(request.user.sub);

    // if (user.role !== UserRole.Admin)
    //   return {
    //     code: 403,
    //     message: 'Not allowed',
    //     data: null,
    //   };
    const currentTime = moment().valueOf();

    // Get all available tickets.
    let availableTicketSellEvents = await (
      await this.eventService.getEventAvailable(currentTime)
    )['toJSON']();
    const totalAvailableTickets = availableTicketSellEvents
      .map((evt) => evt.ticket.remain)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    const firstDailyTime = moment(
      moment().format('YYYY-MM-DD 00:00'),
    ).valueOf();

    const firstWeeklyTime = moment().startOf('week').valueOf();
    const firstMonthlyTime = moment(
      moment().format('YYYY-01-01 00:00:00'),
    ).valueOf();
    const firstYearTime = moment(
      moment().format('1970-01-01 00:00:00'),
    ).valueOf();

    let results = await Promise.all([
      this.eventService.getUserTicketByTime(firstDailyTime, currentTime),
      this.eventService.getUserTicketByTime(firstWeeklyTime, currentTime),
      this.eventService.getUserTicketByTime(firstMonthlyTime, currentTime),
      this.eventService.getUserTicketByTime(firstYearTime, currentTime)
    ]) as any;

    let [
      userTicketDaily,
      userTicketWeekly,
      userTicketMonthly,
      userTicketYearly
    ] = await Promise.all(results.map(result => result['toJSON']()));

    // Get data daily.
    const currentHour = moment(currentTime).format('HH');
    const dailyData = this.eventService.formatEventData(userTicketDaily, +currentHour, 'hours', 'HH:00', 'HH');


    // Get data weekly.
    const endOfWeek = moment().endOf('week').weekday();
    let currentDate = moment().endOf('week');
    const weeklyData = this.eventService.formatEventData(userTicketWeekly, endOfWeek, 'days', 'YYYY-MM-DD', 'DD', currentDate);

    // // Get data monthly.
    let duration = 11;
    currentDate = moment().endOf('year');
    const monthlyData = this.eventService.formatEventData(userTicketMonthly, duration, 'months', 'MMM', 'MM', currentDate)

    // // Get data yearly.
    const currentYear = moment(currentTime);
    const firstItem = userTicketYearly.sort((a, b) => a.timestamp - b.timestamp)
      .find(item => +moment(item.createdAt).format('YYYY') <= +currentYear.format('YYYY'));
    if(!firstItem) {
      duration = 0;
    } else {
      const firstYear = firstItem.createdAt;
      duration = moment.duration(currentYear.diff(firstYear)).asYears();
    }
    const allTimeData = this.eventService.formatEventData(userTicketYearly, duration, 'years', 'YYYY', 'YYYYY')

    // format data response.
    const responseData = this.eventService.formatDataAnalysisResponse(
      dailyData,
      weeklyData, 
      monthlyData, 
      allTimeData, 
      totalAvailableTickets
    );

    // response.
    return {
      code: 200,
      message: '',
      data: responseData,
    };
  }

  @Get('/:id')
  @ApiQuery({
    name: 'relations',
    required: false,
    explode: false,
    type: String,
    isArray: true,
  })
  @Public()
  async getEventById(
    @Param('id') id: string
  ) {
    let event = await this.eventService.getEventById(id);
    if(!event) {
      return {
        code: 400,
        message: 'event_not_found'
      }
    }
    let userTickets = await (await this.eventService.getUserTicketByEventId(id))['populate']();
    userTickets = await userTickets['toJSON']();
    userTickets = userTickets.sort((a, b) => b.timestamp - a.timestamp).map(userTicket => userTicket.user);
    event.boughtTicketUsers = userTickets;

    return {
      code: 200,
      message: '',
      data: event,
    };
  }

  @Get('/:id/analysis')
  @ApiQuery({
    name: 'relations',
    required: false,
    explode: false,
    type: String,
    isArray: true,
  })
  @Public()
  async eventAnalysis(
    @Param('id') id: string,
    @Query('relations') relations?: string[],
  ) {
    let event = await this.eventService.getEventById(id);
    if(!event) {
      return {
        error: 400,
        message: 'event_not_existed'
      }
    }

    const currentTime = moment().valueOf();

    // Get all available tickets.
    let totalAvailableTickets = event.ticket?.remain || 0;
    const firstDailyTime = moment(
      moment().format('YYYY-MM-DD 00:00'),
    ).valueOf();

    const firstWeeklyTime = moment().startOf('week').valueOf();
    const firstMonthlyTime = moment(
      moment().format('YYYY-01-01 00:00:00'),
    ).valueOf();
    const firstYearTime = moment(
      moment().format('1970-01-01 00:00:00'),
    ).valueOf();

    let results = await Promise.all([
      this.eventService.getUserTicketByTimeAndEvent(firstDailyTime, currentTime, id),
      this.eventService.getUserTicketByTimeAndEvent(firstWeeklyTime, currentTime, id),
      this.eventService.getUserTicketByTimeAndEvent(firstMonthlyTime, currentTime, id),
      this.eventService.getUserTicketByTimeAndEvent(firstYearTime, currentTime, id)
    ]) as any;

    let [
      userTicketDaily,
      userTicketWeekly,
      userTicketMonthly,
      userTicketYearly
    ] = await Promise.all(results.map(result => result['toJSON']()));

    // Get data daily.
    const currentHour = moment(currentTime).format('HH');
    const dailyData = this.eventService.formatEventData(userTicketDaily, +currentHour, 'hours', 'HH:00', 'HH');


    // Get data weekly.
    const endOfWeek = moment().endOf('week').weekday();
    let currentDate = moment().endOf('week');
    const weeklyData = this.eventService.formatEventData(userTicketWeekly, endOfWeek, 'days', 'YYYY-MM-DD', 'DD', currentDate);

    // // Get data monthly.
    let duration = 11;
    currentDate = moment().endOf('year');
    const monthlyData = this.eventService.formatEventData(userTicketMonthly, duration, 'months', 'MMM', 'MM', currentDate)

    // // Get data yearly.
    const currentYear = moment(currentTime);
    const firstItem = userTicketYearly.sort((a, b) => a.timestamp - b.timestamp)
      .find(item => +moment(item.createdAt).format('YYYY') <= +currentYear.format('YYYY'));
    if(!firstItem) {
      duration = 0;
    } else {
      const firstYear = firstItem.createdAt;
      duration = moment.duration(currentYear.diff(firstYear)).asYears();
    }
    console.log(duration);
    const allTimeData = this.eventService.formatEventData(userTicketYearly, duration, 'years', 'YYYY', 'YYYYY')

    // format data response.
    const responseData = this.eventService.formatDataAnalysisResponse(
      dailyData,
      weeklyData, 
      monthlyData, 
      allTimeData, 
      totalAvailableTickets
    );

    // response.
    return {
      code: 200,
      message: '',
      data: responseData,
    };
  }

  @Post('/:id/buy-ticket')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async buyEventTicket(
    @Param('id') id: string,
    @Req() request: any,
    @Body() body: BuyTicketDTO,
  ) {
    const user = await this.userService.getUserById(request.user.sub);
    let event = await this.eventService.getEventById(id);

    // Check user is existed.
    if (!user)
      return {
        code: 404,
        message: 'User not found',
        data: null,
      };

    if(!event) {
      return {
        code: 400,
        message: 'event_not_found'
      }
    }

    // Check number ticket is required.
    if (!body.number_ticket) {
      return {
        code: 400,
        message: 'number_ticket_is_required',
        data: null,
      };
    }
    // Check if number ticket user buy great than ticket remain throw error.
    if (body.number_ticket > event.ticket.remain) {
      return {
        code: 400,
        message: 'number_ticket_great_than_ticket_remain',
        data: null,
      };
    }

    // Insert ticket into user ticket.
    const userTicketData = new UserTicket();
    userTicketData.event = event.id;
    userTicketData.user = user;
    userTicketData.number_ticket = body.number_ticket;
    await this.eventService.createUserTicket(userTicketData);

    // Update remain ticket.
    event.ticket.remain -= +body.number_ticket;
    delete event.id;
    delete event.updatedAt;
    event = await this.eventService.updateEvent({
      table: event.table,
      timestamp: event.timestamp
    }, event);

    return {
      code: 200,
      message: 'buy_ticket_successful',
      data: event,
    };
  }
}

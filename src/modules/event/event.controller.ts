import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateEventDTO } from './DTO/create-event.dto';
import { Event } from './event.interface';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/create')
  @UsePipes(new ValidationPipe())
  async createEvent(@Req() request: any, @Body() body: CreateEventDTO) {
    const event = new Event();
    Object.assign(event, body);
    event.userId = request.user.sub;
    event.startDate = new Date(body.startDate);
    event.endDate = new Date(body.endDate);

    const newEvent = await this.eventService.createEvent(event);
    return {
      code: 201,
      message: 'Event created',
      data: newEvent,
    };
  }

  @Get('/')
  async getEvents() {
    const events = await this.eventService.getAllEvents();

    return {
      code: 200,
      message: '',
      data: events,
    };
  }

  @Get('/:id')
  async getEventById(@Param('id') id: string) {
    const event = await this.eventService.getEventById(id);

    return {
      code: 200,
      message: '',
      data: event,
    };
  }
}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { EventsService } from './events.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationSchema } from './notification.schema';
import { RedisModule } from '../redis/redis.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [
    HttpModule,
    DynamooseModule.forFeature([
      {
        name: 'Notification',
        schema: NotificationSchema,
      },
    ]),
    RedisModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [NotificationController],
  exports: [NotificationService],
  providers: [NotificationService, EventsService],
})
export class NotificationModule {}

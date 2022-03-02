import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { EventsService } from './events.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationSchema } from './notification.schema';
import { RedisModule } from '../redis/redis.module';

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
  ],
  controllers: [NotificationController],
  providers: [NotificationService, EventsService],
})
export class NotificationModule {}

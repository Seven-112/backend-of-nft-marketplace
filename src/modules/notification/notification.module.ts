import { NotificationController } from './notification.controller';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationService } from './notification.service';

@Module({
  imports: [HttpModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}

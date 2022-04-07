import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MailModule } from '../mail/mail.module';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionSchema } from './subscription.schema';
import { SubscriptionService } from './subscription.service';
@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Subscription',
        schema: SubscriptionSchema,
      },
    ]),
    MailModule,
  ],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}

import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MailModule } from '../mail/mail.module';
import { SupportController } from './support.controller';
import { SupportSchema } from './support.schema';
import { SupportService } from './support.service';
@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Support',
        schema: SupportSchema,
      },
    ]),
    MailModule,
  ],
  providers: [SupportService],
  exports: [SupportService],
  controllers: [SupportController],
})
export class SupportModule {}

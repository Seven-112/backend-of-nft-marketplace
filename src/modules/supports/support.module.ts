import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { SupportController } from './support.controller';
import { SupportSchema } from './support.schema';
import { SupportService } from './support.service';
@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Supports',
        schema: SupportSchema,
      },
    ]),
    MailModule,
    UserModule
  ],
  providers: [SupportService],
  exports: [SupportService],
  controllers: [SupportController],
})
export class SupportModule {}

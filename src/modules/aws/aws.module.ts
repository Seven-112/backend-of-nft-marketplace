import { Module } from '@nestjs/common';
import { AWSController } from './aws.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [AWSController],
})
export class AWSModule {}

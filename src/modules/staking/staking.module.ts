import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { StakingController } from './staking.controller';

import { StakingSchema } from './staking.schema';
import { StakingService } from './staking.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Stakings',
        schema: StakingSchema,
      }
    ])
  ],
  providers: [StakingService],
  exports: [StakingService],
  controllers: [StakingController],
})
export class StakingModule {}

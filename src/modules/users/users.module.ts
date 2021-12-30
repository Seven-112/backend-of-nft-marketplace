import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

import { UsersController } from './users.controller';
import { UserSchema } from './users.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

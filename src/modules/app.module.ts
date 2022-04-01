import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggerMiddleware, TextBodyMiddleware } from '../middlewares';
import { TodoModule } from './todo/todo.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from '../filter/exception.filter';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NFTModule } from './nft/nft.module';
import { NotificationModule } from './notification/notification.module';
import { NotificationController } from './notification/notification.controller';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ChatModule } from './chat/chat.module';
import { AWSModule } from './aws/aws.module';
import { EventModule } from './event/event.module';
import { SocketModule } from './socket/socket.module';
@Module({
  imports: [
    //dynamoose will get aws key from .env file
    DynamooseModule.forRoot({
      //local: true,
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventModule,
    TodoModule,
    AuthModule,
    UserModule,
    NFTModule,
    NotificationModule,
    ChatModule,
    AWSModule,
    RedisModule.forRoot({
      config: {
        port: +process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
      },
    }),
    SocketModule,
  ],
  controllers: [AppController],
  providers: [
    // { provide: APP_GUARD, useClass: JwtAuthGuard },
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // you can research more to load middleware at here: https://docs.nestjs.com/middleware

    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(TextBodyMiddleware)
      .forRoutes({ path: 'noti', method: RequestMethod.POST });
  }
}

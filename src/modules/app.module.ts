import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { RolesGuard } from 'src/guard/role.guard';
import { NFTModule } from './nft/nft.module';
import { NotificationModule } from './notification/notification.module';
import { NotificationController } from './notification/notification.controller';
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
    TodoModule,
    AuthModule,
    UserModule,
    NFTModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
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
    consumer.apply(TextBodyMiddleware).forRoutes(NotificationController);
  }
}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../middlewares';
import { TodoModule } from './todo/todo.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from '../filter/exception.filter';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
  imports: [
    //dynamoose will get aws key from .env file
    DynamooseModule.forRoot({
      local: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TodoModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // you can research more to load middleware at here: https://docs.nestjs.com/middleware

    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpError } from '../utils/error';
import pino from 'pino';
import { defaultPinoOptions } from '../utils/logger';

const userErrors = [
  {
    name: 'EntityNotFound',
    status: 404,
  },
  {
    name: 'HttpError',
  },
  {
    name: 'NotFoundError',
  },
  { name: 'JobError' },
  {
    name: 'ValidationError',
    status: 400,
  },
];

const logger = pino({ ...defaultPinoOptions, name: 'errorHandler' });

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(err: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const userError = userErrors.find((ue) => ue.name === err.name);

    if (!userError) {
      // not user error, might be fatal ಥ_ಥ, return dummy err
      // to avoid exposing internal information. also log it
      logger.error(err);
      err = new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'error.unknown');
    }

    // const httpStatus =
    // err instanceof HttpException
    //     ? err.getStatus()
    //     : HttpStatus.INTERNAL_SERVER_ERROR;

    // console.log(err);

    // const responseBody = err.response || {
    //   data: null,
    //   //@ts-ignore
    //   message: error.details[0].message,
    // };

    let statusCode = userError?.status || err.status || err.statusCode;
    if (!statusCode || statusCode < 100 || statusCode > 599) statusCode = 500;

    httpAdapter.reply(
      ctx.getResponse(),
      { message: err.message, status: statusCode, data: err.data },
      statusCode,
    );
  }
}

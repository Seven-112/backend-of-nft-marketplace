import { Injectable } from '@nestjs/common';
import { SNSClient } from '@aws-sdk/client-sns';
import { HttpService } from '@nestjs/axios';
import { fromEvent, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import EventEmitter from 'events';

@Injectable()
export class NotificationService {
  snsClient: SNSClient;

  constructor(private httpService: HttpService) {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async callGetApi(url: any): Promise<Observable<AxiosResponse<any, any>>> {
    return this.httpService.get(url);
  }
}

import { SNSClient } from '@aws-sdk/client-sns';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
export declare class NotificationService {
    private httpService;
    snsClient: SNSClient;
    constructor(httpService: HttpService);
    callGetApi(url: any): Promise<Observable<AxiosResponse<any, any>>>;
}

import { Model } from 'nestjs-dynamoose';
import { Staking } from './staking.interface';
import * as moment from 'moment';
export declare class StakingService {
    private readonly stakingModel;
    constructor(stakingModel: Model<Staking, Staking['id']>);
    create(staking: Staking): Promise<import("nestjs-dynamoose").Document<Staking>>;
    formatEventData(initData: any[], currentTime: number, subtractType: any, formatType: string, formatCompare: string, tempDate?: moment.Moment): any[];
    formatDataAnalysisResponse(dailyData: any, weeklyData: any, monthlyData: any, yearlyData: any, allTimeData: any, totalAvailableTickets: number): {
        daily: {
            data: {
                min: number;
                max: number;
                pv: number;
                name: string;
            }[];
            availableTickets: number;
            soldTickets: any;
        };
        weekly: {
            data: any;
            availableTickets: number;
            soldTickets: any;
        };
        monthly: {
            data: any;
            availableTickets: number;
            soldTickets: any;
        };
        yearly: {
            data: any;
            availableTickets: number;
            soldTickets: any;
        };
        allTime: {
            data: any;
            availableTickets: number;
            soldTickets: any;
        };
    };
    getDataByTime(startTime: number, endTime: number): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Staking>>>;
}

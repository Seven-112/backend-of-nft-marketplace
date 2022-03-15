import { PresignURLDTO } from './DTO/presign-url-dto';
export declare class AWSController {
    getPresign(path: string): Promise<unknown>;
    getPresignURL(body: PresignURLDTO): Promise<{
        code: number;
        message: string;
        data: {
            urlUpload: unknown;
            urlEndpoint: string;
        };
    }>;
}

import { PresignURLDTO } from './DTO/presign-url-dto';
export declare class AWSController {
    getPresign(path: string): Promise<unknown>;
    getPresignURL(body: PresignURLDTO): Promise<{
        urlUpload: unknown;
        urlEndpoint: string;
    }>;
}

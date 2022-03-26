import { PresignURLDTO } from './DTO/presign-url-dto';
import { TranslateBodyDTO } from './DTO/translate.dto';
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
    getTranslatedData(body: TranslateBodyDTO): Promise<any>;
}

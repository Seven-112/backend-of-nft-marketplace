import { PresignURLDTO } from './DTO/presign-url-dto';
export declare class S3Controller {
    getPresignURL(body: PresignURLDTO): Promise<unknown>;
}

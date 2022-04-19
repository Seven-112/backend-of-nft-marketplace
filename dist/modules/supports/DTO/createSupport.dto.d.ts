export declare class FileDTO {
    extension: string;
    url: string;
}
export declare class CreateSupportDTO {
    subject: string;
    description: string;
    email: string;
    category: string;
    blockchain: string;
    transaction_hash: string;
    wallet: string;
    file: FileDTO;
}

export declare class CreateNftDTO {
    id: string;
    title: string;
    owner: string;
    imgLink: string;
    metadataPubkey: string;
    type: string;
}
export declare class UpdateNftDTO extends CreateNftDTO {
    price?: string;
    usdPrice?: string;
}

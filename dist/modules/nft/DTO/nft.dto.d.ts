export declare class CreateNftDTO {
    id: string;
    title: string;
    owner: string;
    imgLink: string;
}
export declare class UpdateNftDTO extends CreateNftDTO {
    price?: string;
    usdPrice?: string;
}

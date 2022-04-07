export declare enum Status {
    open = "open",
    supporting = "supporting",
    done = "done"
}
export declare enum ETicketType {
    paid = "paid",
    free = "free"
}
export declare class File {
    extension: string;
    url: string;
}
export declare class Support {
    id: string;
    ticket_uuid: string;
    subject: string;
    description: string;
    email: string;
    category: string;
    blockchain: string;
    transaction_hash: string;
    wallet: string;
    file: File;
    status: Status;
    constructor();
}

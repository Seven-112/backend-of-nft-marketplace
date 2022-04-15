export declare type SupportKey = {
    table: string;
    timestamp: number;
};
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
    name: string;
}
export declare class Reply {
    user: string;
    username: string;
    email: string;
    content: string;
    timestamp: number;
    file: File;
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
    replies: [Reply];
    timestamp: number;
    status: Status;
    table: string;
    constructor();
}

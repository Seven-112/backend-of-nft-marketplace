export declare class HttpError extends Error {
    status: number;
    data?: any;
    toJSON: any;
    constructor(status: number, message?: string, data?: any);
}
export declare class NotFoundError extends HttpError {
    constructor(entity: 'todo' | string, data: any);
}
export declare class BadInputError extends HttpError {
    constructor(i18nKey: string, data?: any);
}

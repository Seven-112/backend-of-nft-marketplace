declare const GoogleGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class GoogleGuard extends GoogleGuard_base {
    constructor();
    handleRequest(err: any, user: any, info: any): any;
}
export {};

import { Strategy } from 'passport-jwt';
declare const JwtSocketStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtSocketStrategy extends JwtSocketStrategy_base {
    constructor();
    validate(payload: unknown): Promise<unknown>;
}
export {};

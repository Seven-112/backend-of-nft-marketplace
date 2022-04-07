export declare class EventsService {
    private readonly emitter;
    constructor();
    subscribe(eventName: string): import("rxjs").Observable<unknown>;
    emit(eventName: string, data: any): Promise<void>;
}

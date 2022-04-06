export declare class BaseModel {
    id: string;
    createdAt: number;
    updatedAt: number;
    updatedBy: any;
    constructor();
}
export declare const baseSchema: {
    id: {
        type: StringConstructor;
        hashKey: boolean;
    };
    createdAt: {
        type: NumberConstructor;
    };
    updatedAt: {
        type: NumberConstructor;
    };
    updatedBy: {
        type: ObjectConstructor;
        schema: {
            userId: {
                type: NumberConstructor;
            };
            username: {
                type: StringConstructor;
            };
        };
    };
};

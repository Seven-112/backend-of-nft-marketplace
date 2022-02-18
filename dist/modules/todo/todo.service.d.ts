import * as Joi from 'joi';
import { Todo } from './todo.interface';
import { Model } from 'nestjs-dynamoose';
export declare class TodoService {
    private todoModel;
    constructor(todoModel: Model<Todo, Todo['id']>);
    static joiSchemaCreate: Joi.ObjectSchema<any>;
    findAll(): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Todo>>>;
    remove(id: string): Promise<void>;
    findOne(id: Todo['id']): Promise<import("nestjs-dynamoose").Document<Todo>>;
}

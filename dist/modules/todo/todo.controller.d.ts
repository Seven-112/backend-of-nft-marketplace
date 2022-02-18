import { Todo } from './todo.interface';
import { TodoService } from './todo.service';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    findAll(): Promise<import("nestjs-dynamoose").ScanResponse<import("nestjs-dynamoose").Document<Todo>>>;
    findOne(id: string): Promise<Todo | undefined>;
}

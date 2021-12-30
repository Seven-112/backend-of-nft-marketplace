import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import { Todo } from './todo.interface';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { AdminSession } from '../../auth/jwt.strategy';
import { NotFoundError } from '../../utils/error';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel('Todo')
    private todoModel: Model<Todo, Todo['id']>,
  ) { }

  static joiSchemaCreate = Joi.object({
    name: Joi.string().trim().min(1).required(),
  });

  async create(
    admin: AdminSession,
    inputTodo: Todo,
  ): Promise<Todo | undefined> {
    const todo = new Todo();

    Object.assign(todo, {
      ...Joi.attempt(inputTodo, TodoService.joiSchemaCreate),
      isDone: false,
      updatedBy: admin,
    });

    return await this.todoModel.create(todo);
  }

  async update(admin: AdminSession, data: Todo) {
    return this.todoModel.update({
      ...data,
      updatedAt: new Date().getTime(),
      updatedBy: admin,
    })
  }

  async findAll() {
    return this.todoModel.scan().exec()
  }

  async remove(id: string) {
    return this.todoModel.delete(id);
  }

  async findOne(id: Todo['id']) {
    const todo = await this.todoModel.get(id);
    if (!todo) {
      throw new NotFoundError('todo', { id: id });
    }
    return todo;
  }
}

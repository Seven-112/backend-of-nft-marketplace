import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Request } from '@nestjs/common';
import { Public } from '../../guard/jwt-auth.guard';
import { Todo } from './todo.interface';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/')
  findAll() {
    return this.todoService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string): Promise<Todo | undefined> {
    return this.todoService.findOne(id);
  }

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // create(@Request() req): Promise<Todo | undefined> {
  //   return this.todoService.create(req.user, req.body);
  // }

  // @Delete()
  // remove(@Request() req) {
  //   return this.todoService.remove(req.body.id);
  // }

  // @Put()
  // update(@Request() req) {
  //   return this.todoService.update(req.user, req.body);
  // }
}

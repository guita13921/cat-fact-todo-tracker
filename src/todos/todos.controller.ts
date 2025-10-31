import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private todos: TodosService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateTodoDto) {
    // `req.user` is populated by the JwtStrategy; we only accept todos for the
    // authenticated account.
    const userId = req.user.userId;
    return this.todos.create(userId, dto.message, dto.date);
  }

  @Get()
  async findAll(@Req() req: any) {
    // Return todos sorted by creation date so the newest items appear first in
    // the front-end list.
    const userId = req.user.userId;
    return this.todos.list(userId);
  }
}

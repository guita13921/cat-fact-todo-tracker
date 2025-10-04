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
    const userId = req.user.userId;
    return this.todos.create(userId, dto.message, dto.date);
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.userId;
    return this.todos.list(userId);
  }
}

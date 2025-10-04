import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

function toDateOnly(dateStr: string): Date {
  // Ensure 'YYYY-MM-DD' format
  const m = /^\d{4}-\d{2}-\d{2}$/.exec(dateStr);
  if (!m) throw new BadRequestException('date must be in YYYY-MM-DD format');
  // Store at 00:00:00Z to preserve date-only semantics
  return new Date(dateStr + 'T00:00:00.000Z');
}

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, message: string, dateStr: string) {
    const date = toDateOnly(dateStr);
    // Fetch cat fact
    const { data } = await axios.get('https://catfact.ninja/fact', { timeout: 8000 });
    const catFact: string = data?.fact || 'Cats are mysterious.';

    const todo = await this.prisma.todo.create({
      data: { userId, message, date, catFact },
    });
    return todo;
  }

  async list(userId: number) {
    return this.prisma.todo.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }
}

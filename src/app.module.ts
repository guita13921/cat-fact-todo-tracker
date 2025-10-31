import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TodosModule } from './todos/todos.module';

// Root module that wires all feature modules together. Keeping the imports
// explicit clarifies the vertical slices of the system (database, auth, todos).

@Module({
  imports: [PrismaModule, AuthModule, TodosModule],
})
export class AppModule {}

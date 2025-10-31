import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
// Expose PrismaService once for the entire application so every module can
// inject it without re-declaring providers.
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

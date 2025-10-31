import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Establish the database connection as soon as Nest boots.
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // `beforeExit` typing is only available in the Node runtime build, so we
    // cast here to keep TypeScript satisfied while still registering the hook.
    this.$on("beforeExit" as never, async () => {
      // Gracefully close the Nest process when Prisma signals a disconnect.
      await app.close();
    });
  }
}

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

// The entry point for the NestJS application. We create the HTTP server,
// register global pipes (validation/transformation), and start listening for
// incoming requests.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe automatically validates DTOs and strips unknown properties
  // to keep the API surface predictable for both the front-end and other
  // clients.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Default to port 8888 so the static front-end can rely on a fixed endpoint.
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 8888);
  console.log(`Server running on http://localhost:${process.env.PORT || 8888}`);
}

bootstrap();

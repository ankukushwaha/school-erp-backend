import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  await app.listen(7240, '0.0.0.0');
  console.log(`Server running on http://localhost:${7240}`);
}
bootstrap();

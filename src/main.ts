import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api")

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("docs", app, document)

  const PORT = process.env.PORT || 3000
  await app.listen(PORT);
  console.log(`server is running at: http://localhost:${PORT}/docs`);

}
bootstrap();

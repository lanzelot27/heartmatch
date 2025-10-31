import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://172.27.64.1:3000', // add your LAN IP here if needed
    ],
    credentials: true,
  });
  // Increase JSON body limit to handle large base64 images
  app.use(bodyParser.json({ limit: '20mb' }));
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port);
  console.log(`\x1b[36m[NestJS] API listening on: http://localhost:${port}\x1b[0m`);
}

bootstrap();

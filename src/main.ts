import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as cors from 'cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Config
  const configService = app.get(ConfigService);

  // Cors
  app.use(
    cors({
      origin: configService.get<string>('SELLER_INTERFACE_URL'),
      credentials: true,
    }),
  );

  // Create microservices
  const authMicroserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: configService.get<string>('RABBITMQ_AUTH_QUEUE'),
      queueOptions: {
        durable: false,
      },
    },
  };

  app.connectMicroservice(authMicroserviceOptions);
  await app.startAllMicroservices();

  await app.listen(3003);
}

bootstrap();

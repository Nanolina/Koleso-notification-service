import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { AuthEventsController, NotificationEventsController } from './events';

@Module({
  imports: [LoggerModule, AuthModule],
  controllers: [
    AuthEventsController,
    NotificationEventsController,
    EmailController,
  ],
  providers: [EmailService, PrismaService],
})
export class EmailModule {}

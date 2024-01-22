import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { UserEventsController } from './events';

@Module({
  imports: [LoggerModule],
  controllers: [UserEventsController, EmailController],
  providers: [EmailService],
})
export class EmailModule {}

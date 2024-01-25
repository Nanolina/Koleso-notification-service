import { Module } from '@nestjs/common';
import { AtStrategy } from '../common/strategies';
import { LoggerModule } from '../logger/logger.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { UserEventsController } from './events';

@Module({
  imports: [LoggerModule],
  controllers: [UserEventsController, EmailController],
  providers: [EmailService, AtStrategy],
})
export class EmailModule {}

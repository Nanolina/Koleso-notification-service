import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { EmailService } from './email.service';
import { UserEventsController } from './events';

@Module({
  imports: [LoggerModule],
  controllers: [UserEventsController],
  providers: [EmailService],
})
export class EmailModule {}

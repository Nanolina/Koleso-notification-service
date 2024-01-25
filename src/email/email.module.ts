import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LoggerModule } from '../logger/logger.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { UserEventsController } from './events';

@Module({
  imports: [LoggerModule, AuthModule],
  controllers: [UserEventsController, EmailController],
  providers: [EmailService],
})
export class EmailModule {}

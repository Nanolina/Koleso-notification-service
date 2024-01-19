import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { UserEventsController } from './events';

@Module({
  controllers: [UserEventsController],
  providers: [EmailService],
})
export class EmailModule {}

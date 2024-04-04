import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MyLogger } from '../../logger/my-logger.service';
import { EmailService } from '../email.service';

@Controller()
export class UserEventsController {
  constructor(
    private emailService: EmailService,
    private readonly logger: MyLogger,
  ) {}

  @EventPattern()
  async handleAllEvents(@Payload() dto: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      switch (dto.eventType) {
        case 'user_created':
          this.logger.log({
            method: 'user_created event',
            log: `received data for email: ${dto.email}`,
          });
          await this.emailService.sendEmailConfirmation(dto);
          break;
        case 'password_reset_requested':
          this.logger.log({
            method: 'password_reset_requested event',
            log: `received data for email: ${dto.email}`,
          });
          await this.emailService.sendPasswordResetLink(dto);
          break;
        case 'email_changed':
          this.logger.log({
            method: 'email_changed event',
            log: `received data for email: ${dto.email}`,
          });
          await this.emailService.sendEmailConfirmation(dto);
          break;
        default:
          this.logger.log({
            method: 'handleAllEvents',
            log: `Unknown event type: ${dto.eventType}`,
          });
      }

      // Confirmation of successful message processing
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error({
        method: `handleAllEvents-${dto.eventType}`,
        error: `Error processing message: ${error.toString()}`,
      });

      // Resend the message to the queue
      channel.nack(originalMsg, false, true);
    }
  }
}

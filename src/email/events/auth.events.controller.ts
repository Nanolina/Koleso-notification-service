import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MyLogger } from '../../logger/my-logger.service';
import { PasswordResetRequestedDto, UserCreatedDto } from '../dto';
import { EmailService } from '../email.service';

@Controller()
export class AuthEventsController {
  constructor(
    private emailService: EmailService,
    private readonly logger: MyLogger,
  ) {}

  @EventPattern('password_reset_requested')
  async passwordResetRequestedEvent(
    @Payload() dto: PasswordResetRequestedDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log({
        method: 'passwordResetRequestedEvent',
        log: `received data for email: ${dto.email}`,
      });

      await this.emailService.sendPasswordResetLink(dto);

      // Confirmation of successful message processing
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error({
        method: 'password_reset_requested',
        error: `Error processing message: ${error.toString()}`,
      });

      // Resend the message to the queue
      channel.nack(originalMsg, false, true);
    }
  }

  @EventPattern('email_changed')
  async emailChangedEvent(
    @Payload() dto: UserCreatedDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log({
        method: 'emailChangedEvent',
        log: `received data for email: ${dto.email}`,
      });

      await this.emailService.sendEmailConfirmation(dto);
      // Confirmation of successful message processing
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error({
        method: 'email_changed',
        error: `Error processing message: ${error.toString()}`,
      });

      // Resend the message to the queue
      channel.nack(originalMsg, false, true);
    }
  }
}

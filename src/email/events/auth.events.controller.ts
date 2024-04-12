import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MyLogger } from '../../logger/my-logger.service';
import { VerificationCodeDto } from '../dto';
import { EmailService } from '../email.service';
import { TypeVerificationCode } from '../types';

@Controller()
export class AuthEventsController {
  constructor(
    private emailService: EmailService,
    private readonly logger: MyLogger,
  ) {}

  @EventPattern('password_reset_requested')
  async passwordResetRequestedEvent(
    @Payload() dto: VerificationCodeDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log({
        method: 'auth-passwordResetRequestedEvent',
        log: `received data for email: ${dto.email}`,
      });

      await this.emailService.sendVerificationCode(
        dto,
        TypeVerificationCode.RESET_PASSWORD,
      );

      // Confirmation of successful message processing
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error({
        method: 'auth-password_reset_requested',
        error: `Error processing message: ${error.toString()}`,
      });

      // Resend the message to the queue
      channel.nack(originalMsg, false, true);
    }
  }

  @EventPattern('email_changed')
  async emailChangedEvent(
    @Payload() dto: VerificationCodeDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log({
        method: 'emailChangedEvent',
        log: `received data for email: ${dto.email}`,
      });

      await this.emailService.sendVerificationCode(
        dto,
        TypeVerificationCode.CONFIRM,
      );
      // Confirmation of successful message processing
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error({
        method: 'auth-email_changed',
        error: `Error processing message: ${error.toString()}`,
      });

      // Resend the message to the queue
      channel.nack(originalMsg, false, true);
    }
  }

  @EventPattern('email_confirmation_code_resended')
  async emailConfirmationCodeResendedEvent(
    @Payload() dto: VerificationCodeDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log({
        method: 'emailConfirmationCodeResendedEvent',
        log: `received data for email: ${dto.email}`,
      });

      await this.emailService.sendVerificationCode(
        dto,
        TypeVerificationCode.CONFIRM,
      );
      // Confirmation of successful message processing
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error({
        method: 'auth-email_confirmation_code_resended',
        error: `Error processing message: ${error.toString()}`,
      });

      // Resend the message to the queue
      channel.nack(originalMsg, false, true);
    }
  }
}

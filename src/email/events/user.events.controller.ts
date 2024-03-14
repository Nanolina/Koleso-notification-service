import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MyLogger } from '../../logger/my-logger.service';
import { PasswordResetRequestedDto, UserCreatedDto } from '../dto';
import { EmailService } from '../email.service';

@Controller()
export class UserEventsController {
  constructor(
    private emailService: EmailService,
    private readonly logger: MyLogger,
  ) {}

  @EventPattern('user_created')
  async userCreatedEvent(dto: UserCreatedDto) {
    this.logger.log({
      method: 'userCreatedEvent',
      log: `received data for email: ${dto.email}`,
    });

    await this.emailService.sendEmailConfirmation(dto);
  }

  @EventPattern('password_reset_requested')
  async passwordResetRequestedEvent(dto: PasswordResetRequestedDto) {
    this.logger.log({
      method: 'passwordResetRequestedEvent',
      log: `received data for email: ${dto.email}`,
    });

    await this.emailService.sendPasswordResetLink(dto);
  }

  @EventPattern('email_changed')
  async emailChangedEvent(dto: any) {
    this.logger.log({
      method: 'emailChangedEvent',
      log: `received data for email: ${dto.email}`,
    });

    await this.emailService.sendEmailConfirmation(dto);
  }
}

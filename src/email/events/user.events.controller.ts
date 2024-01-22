import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MyLogger } from '../../logger/my-logger.service';
import { UserCreatedDto } from '../dto';
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
}

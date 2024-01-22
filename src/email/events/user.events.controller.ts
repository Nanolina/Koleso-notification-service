import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MyLogger } from '../../common/logger';
import { UserCreatedDto } from '../dto';
import { EmailService } from '../email.service';

@Controller()
export class UserEventsController {
  constructor(private emailService: EmailService) {}

  private readonly logger = new MyLogger(EmailService.name);

  @EventPattern('user_created')
  async getUserData(dto: UserCreatedDto) {
    this.logger.log({
      method: 'getUserData, event: user_created',
      log: `received data for email: ${dto.email}`,
    });

    await this.emailService.sendEmail(dto);
  }
}

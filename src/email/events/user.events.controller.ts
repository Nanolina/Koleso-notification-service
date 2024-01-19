import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { UserCreatedDto } from '../dto';
import { EmailService } from '../email.service';

@Controller()
export class UserEventsController {
  constructor(private emailService: EmailService) {}

  @EventPattern('user_created')
  async getUserData(dto: UserCreatedDto) {
    console.log('Received user data', dto);
    await this.emailService.sendEmail(dto);
  }
}

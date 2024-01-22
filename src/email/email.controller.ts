import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserCreatedDto } from './dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('/resend-confirmation')
  @HttpCode(HttpStatus.OK)
  async resendConfirmation(@Body() dto: UserCreatedDto): Promise<void> {
    return this.emailService.sendEmailConfirmation(dto);
  }
}

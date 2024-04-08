import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { VerificationCodeDto } from './dto';
import { EmailService } from './email.service';
import { TypeVerificationCode } from './types';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('/resend-confirmation')
  @HttpCode(HttpStatus.OK)
  async resendConfirmation(@Body() dto: VerificationCodeDto): Promise<void> {
    return this.emailService.sendVerificationCode(
      dto,
      TypeVerificationCode.CONFIRM,
    );
  }
}

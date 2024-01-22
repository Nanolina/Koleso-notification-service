import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from '../common/logger';
import { UserCreatedDto } from './dto';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  private readonly logger = new MyLogger(EmailService.name);

  async sendEmail(dto: UserCreatedDto): Promise<any> {
    const { email, activationLink } = dto;

    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>('SMTP_USER'),
        subject: 'Email confirmation',
        template: 'confirmation-email',
        context: {
          activationLink,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'sendEmail', error });
    }
  }
}

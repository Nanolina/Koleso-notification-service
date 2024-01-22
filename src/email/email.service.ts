import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from '../logger/my-logger.service';
import { UserCreatedDto } from './dto';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly logger: MyLogger,
  ) {}

  async sendEmailConfirmation(dto: UserCreatedDto): Promise<void> {
    const { email, activationLinkId } = dto;

    // Get full activation link
    const activationLink = `${this.configService.get<string>(
      'AUTH_SERVICE_URL',
    )}/auth/activate/${activationLinkId}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>('SMTP_USER'),
        subject: 'Email confirmation',
        template: 'email-confirmation',
        context: {
          activationLink,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'sendEmailConfirmation', error });
    }
  }
}

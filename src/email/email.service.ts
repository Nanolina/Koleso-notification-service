import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerError } from '../common/logger';
import { UserCreatedDto } from './dto';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  private readonly logger = new LoggerError(EmailService.name);

  async sendEmail(dto: UserCreatedDto): Promise<any> {
    const { email, activationLink } = dto;

    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>('SMTP_USER'),
        subject: 'Email confirmation',
        text: '',
        html: `
                <div>
                  <h3>We are glad you have registered on the Koleso platform!</h3>
                  <p>Please confirm your email by clicking on the link below:</p>
                  <p><a href=${activationLink}>${activationLink}</a></p>
                 </div>
              `,
      });
    } catch (error) {
      this.logger.error({ method: 'sendEmail', error });
    }
  }
}

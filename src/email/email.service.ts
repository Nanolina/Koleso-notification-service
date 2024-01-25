import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UNKNOWN_ERROR_TRY } from '../common';
import { MyLogger } from '../logger/my-logger.service';
import { PasswordResetRequestedDto, UserCreatedDto } from './dto';

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

      throw new InternalServerErrorException(UNKNOWN_ERROR_TRY);
    }
  }

  async sendPasswordResetLink(dto: PasswordResetRequestedDto): Promise<void> {
    const { userId, email, passwordResetToken } = dto;

    // Get full password reset link
    const passwordResetLink = `${this.configService.get<string>(
      'AUTH_SERVICE_URL',
    )}/auth/password/reset/${userId}/${passwordResetToken}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>('SMTP_USER'),
        subject: 'Password reset',
        template: 'password-reset',
        context: {
          passwordResetLink,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'sendEmailConfirmation', error });

      throw new InternalServerErrorException(UNKNOWN_ERROR_TRY);
    }
  }
}

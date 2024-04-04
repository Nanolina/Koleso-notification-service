import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailTemplate } from '@prisma/client';
import { UNKNOWN_ERROR_TRY } from '../consts';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordResetRequestedDto, UserCreatedDto } from './dto';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly logger: MyLogger,
  ) {}

  async sendEmailConfirmation(dto: UserCreatedDto): Promise<void> {
    const { id, email, activationLinkId, role } = dto;

    const subject = 'Email confirmation';
    const template = EmailTemplate.CONFIRMATION;

    // Get full activation link
    const activationLink = `${this.configService.get<string>(
      'AUTH_SERVICE_URL',
    )}/auth/activate/${activationLinkId}/${role}`;

    let newEmail;
    try {
      newEmail = await this.prisma.email.create({
        data: {
          email,
          subject,
          template,
          link: activationLink,
          userId: id,
        },
      });
    } catch (error) {
      this.logger.error({
        method: 'sendEmailConfirmation-create-newEmail',
        error,
      });
    }

    try {
      await this.mailerService.sendMail({
        subject,
        template,
        to: email,
        from: this.configService.get<string>('SMTP_USER'),
        context: {
          activationLink,
        },
      });
    } catch (error) {
      await this.prisma.email.update({
        where: {
          id: newEmail?.id,
        },
        data: {
          errorMessage: error?.message || error,
        },
      });

      this.logger.error({ method: 'sendEmailConfirmation-sendMail', error });
      throw new InternalServerErrorException(UNKNOWN_ERROR_TRY);
    }
  }

  async sendPasswordResetLink(dto: PasswordResetRequestedDto): Promise<void> {
    const { userId, email, passwordResetToken } = dto;

    const subject = 'Password reset';
    const template = EmailTemplate.PASSWORD_RESET;

    // Get full password reset link
    const passwordResetLink = `${this.configService.get<string>(
      'AUTH_SERVICE_URL',
    )}/auth/password/reset/${userId}/${passwordResetToken}`;

    let newEmail;
    try {
      newEmail = await this.prisma.email.create({
        data: {
          email,
          subject,
          template,
          userId,
          link: passwordResetLink,
        },
      });
    } catch (error) {
      this.logger.error({
        method: 'sendPasswordResetLink-create-newEmail',
        error,
      });
    }

    try {
      await this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>('SMTP_USER'),
        subject,
        template,
        context: {
          passwordResetLink,
        },
      });
    } catch (error) {
      await this.prisma.email.update({
        where: {
          id: newEmail?.id,
        },
        data: {
          errorMessage: error?.message || error,
        },
      });

      this.logger.error({ method: 'sendPasswordResetLink-sendMail', error });
      throw new InternalServerErrorException(UNKNOWN_ERROR_TRY);
    }
  }
}

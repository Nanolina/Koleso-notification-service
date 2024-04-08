import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailTemplate } from '@prisma/client';
import { UNKNOWN_ERROR_TRY } from '../consts';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationCodeDto } from './dto';
import { TypeVerificationCode } from './types';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly logger: MyLogger,
  ) {}

  async sendVerificationCode(
    dto: VerificationCodeDto,
    type: TypeVerificationCode,
  ): Promise<void> {
    const { id, email, verificationCodeEmail } = dto;

    const subject = `Your verification code: ${verificationCodeEmail}`;
    const template = EmailTemplate.VERIFICATION_CODE;

    let newEmail;
    try {
      newEmail = await this.prisma.email.create({
        data: {
          email,
          subject,
          template,
          code: verificationCodeEmail,
          userId: id,
        },
      });
    } catch (error) {
      this.logger.error({
        method: 'email-sendVerificationCode-create',
        error,
      });

      throw new InternalServerErrorException('Failed to create email record');
    }

    try {
      await this.mailerService.sendMail({
        subject,
        template,
        to: email,
        from: this.configService.get<string>('SMTP_USER'),
        context: {
          type,
          code: verificationCodeEmail,
          minutes: this.configService.get<string>(
            'VERIFICATION_CODE_EXPIRES_IN_MINUTES',
          ),
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

      this.logger.error({ method: 'email-sendVerificationCode-send', error });
      throw new InternalServerErrorException(UNKNOWN_ERROR_TRY);
    }
  }
}

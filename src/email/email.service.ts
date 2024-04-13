import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailTemplate } from '@prisma/client';
import { UNKNOWN_ERROR_TRY } from '../consts';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CodeDto } from './dto';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly logger: MyLogger,
  ) {}

  async sendCode(dto: CodeDto): Promise<void> {
    const { id, email, code, codeType } = dto;

    const subject = `Your code: ${code}`;
    const template = EmailTemplate.CODE;

    let newEmail;
    try {
      newEmail = await this.prisma.email.create({
        data: {
          email,
          subject,
          template,
          code,
          userId: id,
        },
      });
    } catch (error) {
      this.logger.error({
        method: 'email-sendCode-create',
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
          code,
          codeType,
          minutes: this.configService.get<string>('CODE_EXPIRES_IN_MINUTES'),
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

      this.logger.error({ method: 'email-sendCode-send', error });
      throw new InternalServerErrorException(UNKNOWN_ERROR_TRY);
    }
  }
}

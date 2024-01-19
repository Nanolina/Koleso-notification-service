import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerError } from '../common/logger';
import { UserCreatedDto } from './dto';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  private readonly logger = new LoggerError(EmailService.name);

  async sendEmail(dto: UserCreatedDto): Promise<any> {
    console.log('sendEmail', dto);
  }
}

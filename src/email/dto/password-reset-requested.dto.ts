import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class PasswordResetRequestedDto {
  @IsUUID()
  userId: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  passwordResetToken: string;
}

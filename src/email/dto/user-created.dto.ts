import { IsEmail, IsString } from 'class-validator';

export class UserCreatedDto {
  @IsEmail()
  email: string;

  @IsString()
  activationLink: string;
}

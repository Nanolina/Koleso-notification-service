import { IsEmail, IsString, IsUUID } from 'class-validator';

export class UserCreatedDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  activationLinkId: string;
}

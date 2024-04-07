import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { RoleType } from '../../common';
import { IsValidRoleConstraint } from '../validators';

export class PasswordResetRequestedDto {
  @IsUUID()
  userId: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  passwordResetToken: string;

  @IsDefined()
  @Validate(IsValidRoleConstraint)
  role: RoleType;
}

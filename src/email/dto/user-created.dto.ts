import {
  IsDefined,
  IsEmail,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { RoleType } from '../../common';
import { IsValidRoleConstraint } from '../validators';

export class UserCreatedDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  activationLinkId: string;

  @IsDefined()
  @Validate(IsValidRoleConstraint)
  role: RoleType;
}

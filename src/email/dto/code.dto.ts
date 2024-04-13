import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { CodeType } from '../types';
import {
  IsValidCodeConstraint,
  IsValidCodeTypeConstraint,
} from '../validators';

export class CodeDto {
  @IsOptional()
  @IsString()
  eventType?: string;

  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsDefined()
  @Validate(IsValidCodeConstraint)
  code: number;

  @IsDefined()
  @Validate(IsValidCodeTypeConstraint)
  codeType: CodeType;
}

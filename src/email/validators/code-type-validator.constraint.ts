import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CodeType } from '../types';

@ValidatorConstraint({ name: 'isValidCodeType', async: false })
export class IsValidCodeTypeConstraint implements ValidatorConstraintInterface {
  validate(codeType: any) {
    const codeTypeValues = Object.values(CodeType) as string[];
    return typeof codeType === 'string' && codeTypeValues.includes(codeType);
  }

  defaultMessage() {
    return 'The code type is incorrect';
  }
}

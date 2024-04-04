import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RoleType } from '../../common';

@ValidatorConstraint({ name: 'isValidRole', async: false })
export class IsValidRoleConstraint implements ValidatorConstraintInterface {
  validate(role: any) {
    const roleValues = Object.values(RoleType) as string[];
    return typeof role === 'string' && roleValues.includes(role);
  }

  defaultMessage() {
    return 'The role is incorrect';
  }
}

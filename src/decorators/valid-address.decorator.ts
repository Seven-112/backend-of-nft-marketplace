import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as web3 from '@solana/web3.js';

export function ValidAddress(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: ValidAddressConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ValidAddress' })
export class ValidAddressConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    const key = new web3.PublicKey(value);
    const isValid = web3.PublicKey.isOnCurve(key.toBytes());

    return isValid;
  }
}

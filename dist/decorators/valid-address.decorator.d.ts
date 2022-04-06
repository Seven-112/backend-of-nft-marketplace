import { ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare function ValidAddress(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
export declare class ValidAddressConstraint implements ValidatorConstraintInterface {
    validate(value: string): boolean;
}

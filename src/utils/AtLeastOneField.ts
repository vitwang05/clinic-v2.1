import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
  } from 'class-validator';
  
  export function AtLeastOneField(
    properties: string[],
    validationOptions?: ValidationOptions,
  ) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'atLeastOneField',
        target: object.constructor,
        propertyName,
        options: validationOptions,
        validator: {
          validate(_: any, args: ValidationArguments) {
            const obj = args.object as any;
            return properties.some((key) => obj[key] !== null && obj[key] !== undefined);
          },
          defaultMessage(args: ValidationArguments) {
            return `At least one of the following fields is required: ${properties.join(', ')}`;
          },
        },
      });
    };
  }
  
import { Validator, ValidationDefinition, DefinitionType, ValidationResult, ValidationOptions, ValidationError, CleanOptions } from '../interfaces';
export declare class RootValidator implements Validator {
    static RULES: {
        isArray: (value: any, key: string, definition: ValidationDefinition) => ValidationError | null;
        minCount: (value: any, key: string, definition: ValidationDefinition) => ValidationError | null;
        maxCount: (value: any, key: string, definition: ValidationDefinition) => ValidationError | null;
        required: (value: any, key: string, definition: ValidationDefinition) => ValidationError | null;
        allowedValues: (value: any, key: string, definition: ValidationDefinition) => ValidationError | null;
        custom: (value: any, key: string, defintion: ValidationDefinition, object: any, options: ValidationOptions, custom: Function, rule: string) => ValidationError | null;
    };
    static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any): any;
    static getValidator(type: DefinitionType): {
        new (...args: any[]): Validator;
    };
    private getValidator(type);
    private validateType(key, definition, value, options);
    validate(key: string, definition: ValidationDefinition, value: any, options: ValidationOptions): ValidationResult;
    clean(definition: ValidationDefinition, value: any, options: CleanOptions, object: any): any;
}

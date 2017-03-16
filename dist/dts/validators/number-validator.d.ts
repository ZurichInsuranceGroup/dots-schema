import { ValidationDefinition, ValidationError, ValidationOptions } from '../interfaces';
export declare class NumberValidator {
    static RULES: {
        type: (value: any, key: string, definition: ValidationDefinition) => {
            property: string;
            rule: string;
            message: string;
        } | null;
        min: (value: any, key: string, definition: ValidationDefinition) => ValidationError | null;
        max: (value: any, key: string, definition: ValidationDefinition) => ValidationError | null;
    };
    static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any): any;
    static clean(definition: ValidationDefinition, value: any, options: ValidationOptions, object: any): any;
}

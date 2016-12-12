import { Validator, ValidationDefinition, ValidationResult, ValidationOptions, CleanOptions } from '../interfaces';
export declare class SchemaValidator implements Validator {
    static RULES: {
        type: (value: any, key: string, definition: ValidationDefinition) => {
            property: string;
            rule: string;
            message: string;
        } | null;
        schema: (value: any, key: string, definition: ValidationDefinition, options: ValidationOptions) => ValidationResult | null;
    };
    static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any): {
        type: Function;
        schema: Function;
    };
    validate(key: string, definition: ValidationDefinition, value: any, options: ValidationOptions): ValidationResult;
    clean(definition: ValidationDefinition, value: any, options: CleanOptions, object: any): any;
}

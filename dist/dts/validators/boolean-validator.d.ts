import { Validator, ValidationDefinition, ValidationResult, ValidationOptions, CleanOptions } from '../interfaces';
export declare class BooleanValidator implements Validator {
    static RULES: {
        type: (value: any, key: string, definition: ValidationDefinition) => {
            property: string;
            rule: string;
            message: string;
        } | null;
    };
    static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any): {
        type: Function;
    };
    validate(key: string, definition: ValidationDefinition, value: any, options: ValidationOptions): ValidationResult;
    clean(definition: ValidationDefinition, value: any, options: CleanOptions, object: any): any;
}

import { ValidationDefinition, ValidationOptions } from '../interfaces';
import { ComposedValidationResult } from '../composed-validation-result';
export declare class SchemaValidator {
    static RULES: {
        type: (value: any, key: string, definition: ValidationDefinition) => {
            property: string;
            rule: string;
            message: string;
        } | null;
        schema: (value: any, key: string, definition: ValidationDefinition, options: ValidationOptions) => ComposedValidationResult | null;
    };
    static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any): {
        type: Function;
        schema: Function;
    };
    static clean(definition: ValidationDefinition, value: any, options: ValidationOptions, object: any): any;
}

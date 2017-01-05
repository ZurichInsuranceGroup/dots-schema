import { ValidationDefinition, ValidationOptions, CleanOptions } from '../interfaces';
export declare class DateValidator {
    static RULES: {
        type: (value: any, key: string, definition: ValidationDefinition) => {
            property: string;
            rule: string;
            message: string;
        } | null;
        before: (value: any, key: string, definition: ValidationDefinition) => {
            property: string;
            rule: string;
            message: string;
        } | null;
        after: (value: any, key: string, definition: ValidationDefinition) => {
            property: string;
            rule: string;
            message: string;
        } | null;
    };
    static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any): any;
    static clean(definition: ValidationDefinition, value: any, options: CleanOptions, object: any): any;
}

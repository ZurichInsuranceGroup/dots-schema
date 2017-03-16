import { ValidationDefinition, ValidationOptions } from '../interfaces';
export declare class ObjectValidator {
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
    static clean(definition: ValidationDefinition, value: any, options: ValidationOptions, object: any): void;
}

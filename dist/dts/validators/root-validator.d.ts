import { ValidationDefinition, DefinitionType, ValidationOptions, ValidationError } from '../interfaces';
export declare class RootValidator {
    static RULES: {
        isArray: (value: any, key: string, definition: ValidationDefinition) => ValidationError | null;
        minCount: (value: any, key: string, definition: ValidationDefinition) => ValidationError | null;
        maxCount: (value: any, key: string, definition: ValidationDefinition) => ValidationError | null;
        required: (value: any, key: string, definition: ValidationDefinition) => ValidationError | null;
        allowedValues: (value: any, key: string, definition: ValidationDefinition) => ValidationError | null;
        custom: (value: any, key: string, defintion: ValidationDefinition, object: any, options: ValidationOptions, custom: Function, rule: string) => ValidationError | null;
    };
    private static createTypeValidator(key, types, validatorsByType);
    private static createRuleValidator(rule, types, validatorsByType);
    private static createArrayValidator(validator, key);
    static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any): any;
    static getValidator(type: DefinitionType): {
        getValidatorsForKey: (key: string, definition: ValidationDefinition, options: ValidationOptions, object: any) => any;
        clean: (definition: ValidationDefinition, value: any, options: ValidationOptions, object: any) => any;
    };
    static clean(definition: ValidationDefinition, value: any, options: ValidationOptions, object: any): any;
}

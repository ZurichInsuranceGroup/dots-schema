import { ValidationOptions, ValidationResult, CleanOptions } from './interfaces';
export declare class Schema {
    protected schema: any;
    private options;
    readonly name: String;
    static DefaultOptions: ValidationOptions;
    static DefaultCleanOptions: CleanOptions;
    static RegEx: {
        Email: RegExp;
    };
    constructor(schema: any, options?: ValidationOptions);
    private cleanKey(key, object, options?);
    validate(object: any, key?: string | ValidationOptions, options?: ValidationOptions): ValidationResult | null;
    clean(object: any, options?: CleanOptions): any;
    extend(schema: Schema): Schema;
    private _getValidators(object, options?);
    private _getValidatorsForKey(key, object?, options?);
    getValidators(key?: any, object?: any, options?: ValidationOptions): any;
    private _getValidatorForKey(property, object?, options?);
    private _getValidator(object?, options?);
    getValidator(key?: any, object?: any, options?: ValidationOptions): any;
}

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
    private validateKey(value, key, object, options);
    private cleanKey(key, object, options?);
    validate(object: any, key?: string | ValidationOptions, options?: ValidationOptions): ValidationResult | null;
    clean(object: any, options?: CleanOptions): any;
    extend(schema: Schema): Schema;
    getValidators(key?: any, object?: any, options?: ValidationOptions): any;
}

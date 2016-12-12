import { ValidationError, ValidationResult } from './interfaces';
export declare class ComposedValidationResult implements ValidationResult {
    constructor();
    valid: Boolean;
    readonly errors: ValidationError[];
    and(result: ValidationResult | null | ValidationError, key?: String | null): void;
    or(result: ValidationResult | null | ValidationError, key?: String | null): void;
    isValid(): Boolean;
    getErrors(): ValidationError[];
    getValidityByRule(key: string): any;
}

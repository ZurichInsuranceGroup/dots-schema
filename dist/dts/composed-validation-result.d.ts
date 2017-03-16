import { ValidationError, ValidationResult } from './interfaces';
export declare class ComposedValidationResult implements ValidationResult {
    constructor();
    readonly errors: ValidationError[];
    and(result: ValidationResult | null | ValidationError, key?: String | null, index?: number | null): void;
    isValid(): boolean;
    getErrors(): ValidationError[];
}

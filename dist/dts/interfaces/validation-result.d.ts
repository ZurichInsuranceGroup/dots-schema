import { ValidationError } from './validation-error';
export interface ValidationResult {
    isValid(): boolean;
    getErrors(): ValidationError[];
}

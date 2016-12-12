import { ValidationError } from './validation-error';
export interface ValidationResult {
    isValid(): Boolean;
    getErrors(): ValidationError[];
    getValidityByRule(key: string): any;
}

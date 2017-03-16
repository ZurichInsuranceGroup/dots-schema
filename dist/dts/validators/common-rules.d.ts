import { ValidationDefinition, ValidationError } from '../interfaces';
export declare function min(value: any, key: string, definition: ValidationDefinition): null | ValidationError;
export declare function max(value: any, key: string, definition: ValidationDefinition): null | ValidationError;

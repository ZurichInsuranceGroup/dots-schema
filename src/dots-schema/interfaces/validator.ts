import {
    ValidationResult,
    ValidationDefinition,
    ValidationOptions,
    CleanOptions
} from '../interfaces'
import { ComposedValidationResult } from '../composed-validation-result'

export interface Validator {

    validate(key: string, definition: ValidationDefinition, value: any, options: ValidationOptions ): ValidationResult

    clean(definition: ValidationDefinition, value: any, options: CleanOptions, object: any): any

}

import * as _ from 'lodash'

import {
    Validator,
    ValidationDefinition,
    ValidationResult,
    ValidationOptions,
    CleanOptions
}  from '../interfaces'
import { ComposedValidationResult } from '../composed-validation-result'
import { cleaned } from '../cleaned'

export class ObjectValidator implements Validator {

     public static RULES = {
        type: (value: any, key: string, definition: ValidationDefinition) => {
            if ((typeof value !== 'undefined' && value !== null) && typeof value !== 'object') {
                return {
                    property: key,
                    rule: 'type',
                    message: `Property ${key} must be of type Object`
                }
            }
            return null
        }
    }

    public static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any) {
        return {
            type: cleaned(ObjectValidator.RULES.type, key, definition, options)
        }
    }

    validate(key: string, definition: ValidationDefinition, value: any, options: ValidationOptions): ValidationResult {
        const result = new ComposedValidationResult()
        const rules = ObjectValidator.RULES

        result.and(rules.type(value, key, definition))

        return result
    }

    clean(definition: ValidationDefinition, value: any, options: CleanOptions, object: any): void {
        return value
    }

}

import toLower from 'lodash.tolower'

import {
    ValidationDefinition,
    ValidationResult,
    ValidationOptions,
}  from '../interfaces'
import { ComposedValidationResult } from '../composed-validation-result'
import { cleaned } from '../cleaned'

export class BooleanValidator {

    public static RULES = {
        type: (value: any, key: string, definition: ValidationDefinition) => {
            if ((typeof value !== 'undefined' && value !== null) && typeof value !== 'boolean') {
                return {
                    property: key,
                    rule: 'type',
                    message: `Property ${key} must be of type Boolean`
                }
            }
            return null
        }
    }

    public static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any) {
        return {
            type: cleaned(BooleanValidator.RULES.type, key, definition, options)
        }
    }

    public static clean(definition: ValidationDefinition, value: any, options: ValidationOptions, object: any): any {
        if (!options.castTypes || typeof value === 'undefined') {
            return value
        }
        if (typeof value === 'string') {
            if (toLower(value) === 'false') {
                return false
            }
        } else if (value) {
            return true
        } else {
            return false
        }
    }

}

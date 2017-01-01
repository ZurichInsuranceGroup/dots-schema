import * as _ from 'lodash'

import {
    ValidationDefinition,
    ValidationResult,
    ValidationOptions,
    CleanOptions
}  from '../interfaces'
import { ComposedValidationResult } from '../composed-validation-result'
import { cleaned } from '../cleaned'

export class ObjectValidator  {

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

    public static clean(definition: ValidationDefinition, value: any, options: CleanOptions, object: any): void {
        return value
    }

}

import * as moment from 'moment'
import * as _ from 'lodash'

import {
    ValidationDefinition,
    ValidationResult,
    ValidationOptions,
    CleanOptions
}  from '../interfaces'
import { ComposedValidationResult } from '../composed-validation-result'
import { cleaned } from '../cleaned'
import { min, max } from './common-rules'

export class StringValidator {

    public static RULES = {
        type: (value: any, key: string, definition: ValidationDefinition) => {
            if ((typeof value !== 'undefined' && value !== null) && typeof value !== 'string') {
                return {
                    property: key,
                    rule: 'type',
                    message: `Property ${key} must be of type String`
                }
            }
            return null
        },
        regEx: (value: any, key: string, definition: ValidationDefinition) => {
            if (typeof value === 'string' && definition.regEx instanceof RegExp && !definition.regEx.test(value)) {
                return {
                    property: key,
                    rule: 'regEx',
                    message: `Property ${key} must match ${definition.regEx.toString()}`
                }
            }
            return null
        },
        min,
        max
    }

    public static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any) {
        const validators: any = {
            type: cleaned(StringValidator.RULES.type, key, definition, options)
        }

        if (typeof definition.min !== 'undefined') {
            validators.min = cleaned(StringValidator.RULES.min, key, definition, options)
        }

        if (typeof definition.max !== 'undefined') {
            validators.max = cleaned(StringValidator.RULES.max, key, definition, options)
        }

        if (definition.regEx) {
            validators.regEx = cleaned(StringValidator.RULES.regEx, key, definition, options)
        }

        return validators
    }

    public static clean(definition: ValidationDefinition, value: any, options: CleanOptions, object: any): any {

        if (options.autoConvert && typeof value !== 'string') {
            if (typeof value === 'number' || typeof value === 'boolean') {
                return value.toString()
            } else if (value instanceof Date) {
                if (typeof definition.dateFormat === 'string') {
                    return moment(value).format(definition.dateFormat)
                } else {
                    return moment(value).format()
                }
            }
        }

        if (typeof value === 'string') {
            if (options.trimStrings || definition.trim) {
                if (definition.trim !== false) {
                    value = value.trim()
                }
            }

            if (value.trim().length === 0 && (definition.removeEmpty || options.removeEmptyStrings)) {
                if (definition.removeEmpty !== false) {
                    value = null
                }
            }
        }

        return value
    }

}

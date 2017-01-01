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
import { min, max } from './common-rules'

export class NumberValidator implements Validator {

     public static RULES = {
        type: (value: any, key: string, definition: ValidationDefinition) => {
            if ((typeof value !== 'undefined' && value !== null) && typeof value !== 'number') {
                return {
                    property: key,
                    rule: 'type',
                    message: `Property ${key} must be of type Number`
                }
            }
            return null
        },
        min,
        max
    }

    public static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any) {
        const validators: any = {
            type: cleaned(NumberValidator.RULES.type, key, definition, options)
        }

        if (typeof definition.min !== 'undefined') {
            validators.min = cleaned(NumberValidator.RULES.min, key, definition, options)
        }

        if (typeof definition.max !== 'undefined') {
            validators.max = cleaned(NumberValidator.RULES.max, key, definition, options)
        }

        return validators
    }

    validate(key: string, definition: ValidationDefinition, value: any, options: ValidationOptions): ValidationResult {
        const result = new ComposedValidationResult()
        const rules = NumberValidator.RULES

        result.and(rules.type(value, key, definition))
        if (result.isValid()) {
            result.and(rules.min(value, key, definition))
            result.and(rules.max(value, key, definition))
        }

        return result
    }

    clean(definition: ValidationDefinition, value: any, options: CleanOptions, object: any): any {
        if (!options.autoConvert) {
            return value
        }
        if (typeof value === 'string') {
            let result: number = parseFloat(value)

            if (_.isNaN(result)) {
                return value
            }

            value = result
        }

        if (typeof value === 'number') {
            if (definition.decimal) {
                return value
            } else {
                const rounding = definition.rounding ? definition.rounding : options.rounding
                switch(rounding) {
                    case 'round':
                        return Math.round(value)
                    case 'floor':
                        return Math.floor(value)
                    case 'ceil':
                        return Math.ceil(value)
                }
            }
        }

        return value
    }

}

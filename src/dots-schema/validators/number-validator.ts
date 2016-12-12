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
        min: (value: any, key: string, definition: ValidationDefinition) => {
            if ((typeof value !== 'undefined' && value !== null) && (typeof definition.min === 'number') && value < definition.min) {
                return {
                    property: key,
                    rule: 'min',
                    message: `Property ${key} must be greater than ${definition.min}`
                }
            }
            return null
        },
        max: (value: any, key: string, definition: ValidationDefinition) => {
            if ((typeof value !== 'undefined' && value !== null) && (typeof definition.max === 'number') && value > definition.max) {
                return {
                    property: key,
                    rule: 'max',
                    message: `Property ${key} must be greater than ${definition.max}`
                }
            }
            return null
        }
    }

    public static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any) {
        const validators: any = {
            type: cleaned(NumberValidator.RULES.type, key, definition, options)
        }

        if (definition.min) {
            _.assign(validators, cleaned(NumberValidator.RULES.min, key, definition, options))
        }

        if (definition.max) {
            _.assign(validators, cleaned(NumberValidator.RULES.max, key, definition, options))
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

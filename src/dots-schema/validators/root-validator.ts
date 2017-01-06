import * as _ from 'lodash'

import {
    ValidationDefinition,
    DefinitionType,
    ValidationResult,
    ValidationOptions,
    ValidationError,
    CleanOptions
} from '../interfaces'
import { ComposedValidationResult } from '../composed-validation-result'
import { StringValidator } from './string-validator'
import { NumberValidator } from './number-validator'
import { DateValidator } from './date-validator'
import { ObjectValidator } from './object-validator'
import { SchemaValidator } from './schema-validator'
import { BooleanValidator } from './boolean-validator'
import { Schema } from '../schema'
import { cleaned } from '../cleaned'

export class RootValidator {

    public static RULES = {
        isArray: (value: any, key: string, definition: ValidationDefinition): ValidationError | null => {
            if ((typeof value !== 'undefined' && value !== null) && !Array.isArray(value)) {
                return {
                    property: key,
                    rule: 'type',
                    message: `Property ${key} expected to be an array of type ${definition.type.name}`
                }
            }
            return null
        },
        minCount: (value: any, key: string, definition: ValidationDefinition): ValidationError | null => {
            if ((typeof value !== 'undefined' && value !== null) && (typeof definition.minCount === 'number') && value.length < definition.minCount) {
                return {
                    property: key,
                    rule: 'minCount',
                    message: `Property ${key} expected to be an array of type ${definition.type.name} with at least ${definition.minCount} elements`
                }
            }

            return null
        },
        maxCount: (value: any, key: string, definition: ValidationDefinition): ValidationError | null => {
            if ((typeof value !== 'undefined' && value !== null) && (typeof definition.maxCount === 'number') && value.length > definition.maxCount) {
                return {
                    property: key,
                    rule: 'maxCount',
                    message: `Property ${key} expected to be an array of type ${definition.type.name} with at max ${definition.maxCount} elements`
                }
            }
            return null
        },
        required: (value: any, key: string, definition: ValidationDefinition): ValidationError | null => {
            if (!definition.optional && (typeof value === 'undefined' || value == null)) {
                return {
                    property: key,
                    rule: 'required',
                    message: `Missing value for property ${key}`
                }
            }
            return null
        },
        allowedValues: (value: any, key: string, definition: ValidationDefinition): ValidationError | null => {
            if ((typeof value !== 'undefined' && value !== null) && typeof definition.allowedValues !== 'undefined') {
                if (definition.allowedValues.indexOf(value) === -1) {
                    return {
                        property: key,
                        rule: 'allowedValues',
                        message: `Value of ${key} is not in allowedValues`
                    }
                }
            }
            return null
        },
        custom: (value: any, key: string, defintion: ValidationDefinition, object: any, options: ValidationOptions, custom: Function, rule: string): ValidationError | null => {
            const error = custom(value, object, options.context)

            if (typeof error === 'string') {
                return {
                    property: key,
                    rule: rule,
                    message: error
                }
            }
            return null
        }
    }

    // for the type rule, the value is valid if at least one type is valid
    private static createTypeValidator(key: string, types: Function[], validatorsByType: any) {
        return (value: any, object?: any, options?: ValidationOptions) => {
            for (let type of types) {
                const validator = validatorsByType[type.name].type
                if (validator(value, object, options) === null) {
                    return null
                }
            }
            return {
                property: key,
                rule: 'type',
                message: `Property ${key} must be one of [${Object.keys(validatorsByType).join(', ')}]`
            }
        }
    }

    // every other rule gets passed down to every typeValidator that supports the rule
    private static createRuleValidator(rule: string, types: Function[], validatorsByType: any) {
        return (value: any, object?: any, options?: ValidationOptions) => {
            for (let type of types) {
                const validator = validatorsByType[type.name][rule]

                if (typeof validator === 'function') {
                    return validator(value, object, options)
                }
            }
            return null
        }
    }

    private static createArrayValidator(validator: (value: any, object?: any, options?: ValidationOptions) => any, key: string) {
        return (value: any, object?: any, options?: ValidationOptions) => {
            if (_.isArray(value)) {
                const result = new ComposedValidationResult()
                for (let index = 0; index < value.length; index++) {
                    result.and(validator(value[index], object, options), null, index)
                }
                return result
            }
            return null
        }
    }

    public static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any) {
        const validators: any = {}

        if (!definition.optional) {
            validators.required = cleaned(RootValidator.RULES.required, key, definition, options)
        }

        if (definition.allowedValues) {
            validators.allowedValues = cleaned(RootValidator.RULES.allowedValues, key, definition, options)
        }

        if (definition.array) {
            validators.isArray = cleaned(RootValidator.RULES.isArray, key, definition, options)
        }

        if (typeof definition.minCount !== 'undefined') {
            validators.minCount = cleaned(RootValidator.RULES.minCount, key, definition, options)
        }

        if (typeof definition.maxCount !== 'undefined') {
            validators.maxCount = cleaned(RootValidator.RULES.maxCount, key, definition, options)
        }

        if (definition.custom)  {
            if (typeof definition.custom === 'function') {
                validators.custom = cleaned(RootValidator.RULES.custom, key, definition, options, object, definition.custom, 'custom')
            } else if (typeof definition.custom === 'object') {
                for (let rule in definition.custom) {
                    if (definition.custom.hasOwnProperty(rule)) {
                        validators[rule] = cleaned(RootValidator.RULES.custom, key, definition, options, object, definition.custom[rule], rule)
                    }
                }
            }
        }


        const types = _.isArray<DefinitionType>(definition.type) ? definition.type : [definition.type]

        const validatorsByType: any = {}
        let rules: any[] = []

        for (let type of types) {
            const validators = this.getValidator(type).getValidatorsForKey(key, definition, options, object)
            validatorsByType[type.name] = validators
            rules = _.union(rules, Object.keys(validators))
        }

        if (definition.array) {
            for (let rule of rules) {
                validators[rule] = rule === 'type' ?
                    RootValidator.createArrayValidator(RootValidator.createTypeValidator(key, types, validatorsByType), key) :
                    RootValidator.createArrayValidator(RootValidator.createRuleValidator(rule, types, validatorsByType), key)
            }
        } else {
            for (let rule of rules) {
                validators[rule] = rule === 'type' ?
                    RootValidator.createTypeValidator(key, types, validatorsByType) :
                    RootValidator.createRuleValidator(rule, types, validatorsByType)
            }
        }

        return validators
    }

    public static getValidator(type: DefinitionType): {
            getValidatorsForKey: (key: string, definition: ValidationDefinition, options: ValidationOptions, object: any) => any,
            clean: (definition: ValidationDefinition, value: any, options: CleanOptions, object: any) => any
    } {
        switch (type) {
            case String:
                return StringValidator
            case Number:
                return NumberValidator
            case Date:
                return DateValidator
            case Object:
                return ObjectValidator
            case Boolean:
                return BooleanValidator
            default:
                if (type instanceof Schema) {
                    return SchemaValidator
                } else {
                    throw new Error(`Unkown type ${type} used in schema`)
                }
        }
    }

    public static clean(definition: ValidationDefinition, value: any, options: CleanOptions, object: any): any {
        let result: any = value

        if (options.removeEmptyStrings && typeof result === 'string' && value.trim().length === 0) {
            if (definition.removeEmpty !== false) {
                result = null
            }
        } else if (options.removeEmptyObjects && typeof result === 'object' && _.isEmpty(result) && !_.isDate(result)) {
            if (definition.removeEmpty !== false) {
                result = null
            }
        }
        const types: DefinitionType[] = Array.isArray(definition.type) ? (definition.type as DefinitionType[]) : [definition.type as DefinitionType]

        if (typeof result === 'undefined' || result == null) {
            if (typeof definition.defaultValue !== 'undefined') {
                result = _.cloneDeep(definition.defaultValue)
            }
        }

        if (options.getAutoValues && typeof definition.autoValue === 'function') {
            result = definition.autoValue(result, object)
        }

        for (let type of _.reverse(types) as DefinitionType[]) {
            result = RootValidator.getValidator(type).clean(definition, result, options, object)
        }

        return result
    }
}

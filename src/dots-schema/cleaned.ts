import * as _ from 'lodash'

import {
    Validator,
    ValidationDefinition,
    DefinitionType,
    ValidationResult,
    ValidationOptions,
    ValidationError,
    CleanOptions
} from './interfaces'
import { RootValidator } from './validators/root-validator'
import { Schema } from './schema'

export function cleaned(validator: any, key: string, definition: ValidationDefinition, options: ValidationOptions, defaultObject?: any, custom?: Function, rule?: string): Function {
    const rootValidator = new RootValidator()
    const defaultOptions = options
    const defaultCleanOptions = typeof options.clean === 'object' ? _.defaults({}, options.clean, Schema.DefaultCleanOptions) : _.defaults({}, Schema.DefaultCleanOptions)

    return (value: any, object?: any, options?: ValidationOptions) => {
        let cleanOptions = defaultCleanOptions
        options = _.assign({}, defaultOptions, options)

        object = typeof object !== 'undefined' ? object : defaultObject

        if (options.clean) {
            const cleanOptions = options.clean === 'object' ? _.assign({}, defaultCleanOptions, options.clean) : _.assign({}, defaultCleanOptions)
            value = rootValidator.clean(definition, value, cleanOptions, object)
        }

        return validator(value, key, definition, object, options, custom, rule)
    }
}

const connectSchema = (schema: Schema, object: any, context: any): any => {
    const validators = schema.getValidators()
    const connected: any = {}

    for (let field in validators) {
        if (validators.hasOwnProperty(field)) {
            const fieldValidators = validators[field]
            const fieldConnected: any = {}
            for (let rule in fieldValidators) {
                if (fieldValidators.hasOwnProperty(rule)) {
                    fieldConnected[rule] = _.partialRight(fieldValidators[rule], object, {
                        context: context,
                        clean: true
                    })
                }
            }
            connected[field] = fieldConnected
        }
    }
    return connected
}

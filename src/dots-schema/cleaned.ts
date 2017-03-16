import assign from 'lodash.assign'
import partialRight from 'lodash.partialright'
import defaults from 'lodash.defaults'

import {
    ValidationDefinition,
    DefinitionType,
    ValidationResult,
    ValidationOptions,
    ValidationError
} from './interfaces'
import { RootValidator } from './validators/root-validator'
import { Schema } from './schema'

export function cleaned(validator: any, key: string, definition: ValidationDefinition, options: ValidationOptions, defaultObject?: any, custom?: Function, rule?: string): Function {
    const defaultOptions = options

    return (value: any, object?: any, options?: ValidationOptions) => {
        options = assign({}, defaultOptions, options)

        object = typeof object !== 'undefined' ? object : defaultObject

        if (options && options.autoClean) {
            value = RootValidator.clean(definition, value, options, object)
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
                    fieldConnected[rule] = partialRight(fieldValidators[rule], object, {
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

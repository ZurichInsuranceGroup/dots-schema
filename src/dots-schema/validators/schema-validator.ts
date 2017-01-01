import * as _ from 'lodash'

import {
    ValidationDefinition,
    ValidationResult,
    ValidationOptions,
    CleanOptions
}  from '../interfaces'
import { ComposedValidationResult } from '../composed-validation-result'
import { Schema } from '../schema'
import { cleaned } from '../cleaned'

export class SchemaValidator {

    public static RULES = {
        type: (value: any, key: string, definition: ValidationDefinition) => {
            if ((typeof value !== 'undefined' && value !== null) && (!(_.isObject(value) || _.isArray(value)))) {
                return {
                    property: key,
                    rule: 'type',
                    message: `Property ${key} must be an Object or an Array of Objects`
                }
            }
            return null
        },
        schema: (value: any, key: string, definition: ValidationDefinition, options: ValidationOptions) => {
            if (value instanceof Schema || typeof value === 'object') {
                const schema: Schema = definition.type as Schema
                const result = new ComposedValidationResult()
                result.and(schema.validate(value, options), key)
                return result
            }
            return null
        }
    }

    public static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any) {
        return {
            type: cleaned(SchemaValidator.RULES.type, key, definition, options),
            schema: cleaned(SchemaValidator.RULES.schema, key, definition, options)
        }
    }

    public static clean(definition: ValidationDefinition, value: any, options: CleanOptions, object: any): any {
        const schema: Schema = definition.type as Schema
        return schema.clean(value, options)
    }

}

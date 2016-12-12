import * as _ from 'lodash'

import {
    Validator,
    ValidationDefinition,
    ValidationResult,
    ValidationOptions,
    CleanOptions
}  from '../interfaces'
import { ComposedValidationResult } from '../composed-validation-result'
import { Schema } from '../schema'
import { cleaned } from '../cleaned'

export class SchemaValidator implements Validator {

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
            const schema: Schema = definition.type as Schema

            return schema.validate(value, options)
        }
    }

    public static getValidatorsForKey(key: string, definition: ValidationDefinition, options: ValidationOptions, object?: any) {
        return {
            type: cleaned(SchemaValidator.RULES.type, key, definition, options),
            schema: cleaned(SchemaValidator.RULES.schema, key, definition, options)
        }
    }

    validate(key: string, definition: ValidationDefinition, value: any, options: ValidationOptions): ValidationResult {
        const result = new ComposedValidationResult()
        const rules = SchemaValidator.RULES

        result.and(rules.type(value, key, definition))

        if (result.isValid()) {
            result.and(rules.schema(value, key, definition, options), key)
        }

        return result
    }

    clean(definition: ValidationDefinition, value: any, options: CleanOptions, object: any): any {
        const schema: Schema = definition.type as Schema
        return schema.clean(value, options)
    }

}

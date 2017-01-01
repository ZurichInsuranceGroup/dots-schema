import * as _ from 'lodash'

import {
    ValidationOptions,
    ValidationResult,
    ValidationDefinition,
    CleanOptions
} from './interfaces'
import { ComposedValidationResult} from './composed-validation-result'
import { RootValidator } from './validators/root-validator'

export class Schema {

    readonly name: String

    static DefaultOptions: ValidationOptions = {
        name: 'Schema',
        clean: false,
        strict: false,
        context: {}
    }

    static DefaultCleanOptions: CleanOptions = {
        mutate: false,
        trimStrings: true,
        removeEmptyStrings: true,
        removeEmptyObjects: true,
        rounding: 'round',
        filter: false,
        autoConvert: true,
        getAutoValues: true
    }

    static RegEx = {
        Email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    }

    constructor(protected schema: any, private options: ValidationOptions = {}) {
        _.defaults(options, Schema.DefaultOptions)
    }

    private validateKey(value: any, key: string, object: any, options: ValidationOptions): ValidationResult {
        const rootValidator = new RootValidator()
        const definition: ValidationDefinition = this.schema[key] as ValidationDefinition

        if (definition.type instanceof Function || definition.type instanceof Schema || _.isObject(definition.type)) {
            const result = rootValidator.validate(key, definition, value, options) as ComposedValidationResult
            if (typeof definition.custom === 'function') {
                let custom = definition.custom(value, object, options.context)
                if (custom) {
                    result.and({
                        property: key,
                        rule: 'custom',
                        message: custom
                    })
                }
            } else if (typeof definition.custom === 'object') {
                for (let rule in definition.custom) {
                    if (definition.custom.hasOwnProperty(rule)) {
                        let custom = definition.custom[rule](value, object, options.context)
                        if (custom) {
                            result.and({
                                property: key,
                                rule: rule,
                                message: custom
                            })
                        }
                    }
                }
            }
            return result
        } else {
            throw new Error(`Invalid type '${definition.type}' used in ${this.name}`)
        }

    }

    private cleanKey(key: string, object: any, options: CleanOptions = {}) {
        const rootValidator = new RootValidator()
        const definition: ValidationDefinition = this.schema[key] as ValidationDefinition

        if (definition.type instanceof Function || definition.type instanceof Schema || _.isObject(definition.type)) {
            return rootValidator.clean(definition, object[key], options, object)
        } else {
            throw new Error(`Invalid type '${definition.type}' used in ${this.name}`)
        }
    }

    public validate(object: any, key?: string | ValidationOptions, options?: ValidationOptions): ValidationResult | null {
        options = _.defaults(key || {}, Schema.DefaultOptions)
        if (typeof key === 'string') {
            const validator = this.getValidator(key, object, options)
            if (options.clean) {
                const cleanOptions = _.defaults({}, options.clean, Schema.DefaultCleanOptions)
                object = this.clean(object, cleanOptions)
            }
            const result = validator(object, options)
            return result.isValid() ? null : result
        } else {
            const validator = this.getValidator(object, options)
            if (options.clean) {
                const cleanOptions = _.defaults({}, options.clean, Schema.DefaultCleanOptions)
                object = this.clean(object, cleanOptions)
            }
            const result = validator(object, options)
            return result.isValid() ? null : result
        }
    }

    public clean(object: any, options: CleanOptions = {}): any {
        if (typeof object === 'undefined' || object === null) {
            return object
        }
        _.defaults(options, Schema.DefaultCleanOptions)
        const result = options.mutate ? object : _.cloneDeep(object)

        for (let key in this.schema) {
            if (this.schema.hasOwnProperty(key)) {
                result[key] = this.cleanKey(key, object, options)
            }
        }

        return result
    }

    public extend(schema: Schema): Schema {
        return this
    }

    private _getValidators(object: any, options?: ValidationOptions): any {
        options = typeof options === 'object' ? _.defaults(options, this.options) : this.options
        const validators: any = {}
        for (let key in this.schema) {
            if (this.schema.hasOwnProperty(key)) {
                const keyValidators = {}
                _.assign(keyValidators, RootValidator.getValidatorsForKey(key, this.schema[key], options, object))
                validators[key] = keyValidators
            }
        }
        return validators
    }

    private _getValidatorsForKey(key: any, object?: any, options?: ValidationOptions): any {
        options = typeof options === 'object' ? _.defaults(options, this.options) : this.options
        return RootValidator.getValidatorsForKey(key, this.schema[key], options, object)
    }

    public getValidators(key?: any, object?: any, options?: ValidationOptions): any {
        if (typeof key === 'string') {
            return this._getValidatorsForKey(key, object, options)
        } else {
            return this._getValidators(key, object)
        }
    }

    private _getValidatorForKey(property: string, object?: any, options?: ValidationOptions): any {
        const validators = this.getValidators(object, options)

        return (value: any, object?: any, options?: ValidationOptions) => {
            const result = new ComposedValidationResult()
            if (validators.hasOwnProperty(property)) {
                const propertyValidators = validators[property]

                for (let rule in propertyValidators) {
                    if (propertyValidators.hasOwnProperty(rule)) {
                        const validator = propertyValidators[rule]
                        const error = validator(value[property], object, options)

                        if (typeof error === 'string') {
                            result.and({
                                property: property,
                                rule: rule,
                                message: error
                            })
                        } else if (typeof error === 'object') {
                            result.and(error)
                        }
                    }
                }
            }
            return result
        }
    }

    private _getValidator(object?: any, options?: ValidationOptions): any {
        const validators = this.getValidators(object, options)

        return (value: any, object?: any, options?: ValidationOptions) => {
            const result = new ComposedValidationResult()
            for (let property in validators) {
                if (validators.hasOwnProperty(property)) {
                    const propertyValidators = validators[property]

                    for (let rule in propertyValidators) {
                        if (propertyValidators.hasOwnProperty(rule)) {
                            const validator = propertyValidators[rule]
                            const error = validator(value[property], object, options)

                            if (typeof error === 'string') {
                                result.and({
                                    property: property,
                                    rule: rule,
                                    message: error
                                })
                            } else if (typeof error === 'object') {
                                result.and(error)
                            }
                        }
                    }
                }
            }
            return result
        }
    }

    public getValidator(key?: any, object?: any, options?: ValidationOptions): any {
        if (typeof key === 'string') {
            return this._getValidatorForKey(key, object, options)
        } else {
            return this._getValidator(key, object)
        }
    }
}

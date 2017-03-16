import defaults from 'lodash.defaults'
import cloneDeep from 'lodash.clonedeep'
import assign from 'lodash.assign'
import isObject from 'lodash.isobject'

import {
    ValidationOptions,
    ValidationResult,
    ValidationDefinition
} from './interfaces'
import { ComposedValidationResult} from './composed-validation-result'
import { RootValidator } from './validators/root-validator'

export class Schema {

    readonly name: String

    static DefaultOptions: ValidationOptions = {
        name: 'Schema',
        autoClean: false,
        allowExtras: false,
        context: {},
        mutate: false,
        trimStrings: true,
        removeEmptyStrings: true,
        removeEmptyObjects: true,
        rounding: 'round',
        removeExtras: false,
        castTypes: true
    }

    static RegEx = {
        Email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    }

    constructor(protected schema: any, private options: ValidationOptions = {}) {
        defaults(options, Schema.DefaultOptions)
    }

    private cleanKey(key: string, object: any, options: ValidationOptions = {}) {
        const definition: ValidationDefinition = this.schema[key] as ValidationDefinition

        if (definition.type instanceof Function || definition.type instanceof Schema || isObject(definition.type)) {
            return RootValidator.clean(definition, object[key], options, object)
        } else {
            throw new Error(`Invalid type '${definition.type}' used in ${this.name}`)
        }
    }

    public validate(object: any, key?: string | ValidationOptions, options?: ValidationOptions): ValidationResult | null {
        if (typeof key === 'string') {
            options = defaults({}, options, Schema.DefaultOptions)

            const validator = this.getValidator(key, object, options)
            if (options && options.autoClean) {
                object = this.clean(object, options)
            }
            return validator(object, object, options)
        } else {
            options = defaults({}, key, Schema.DefaultOptions)

            const validator = this.getValidator(object, options)
            if (options && options.autoClean) {
                object = this.clean(object, options)
            }
            return validator(object, object, options)
        }
    }

    public clean(object: any, options: ValidationOptions = {}): any {
        if (typeof object === 'undefined' || object === null) {
            return object
        }
        defaults(options, Schema.DefaultOptions)
        const result = options.mutate ? object : cloneDeep(object)

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
        options = typeof options === 'object' ? defaults(options, this.options) : this.options
        const validators: any = {}
        for (let key in this.schema) {
            if (this.schema.hasOwnProperty(key)) {
                const keyValidators = {}
                assign(keyValidators, RootValidator.getValidatorsForKey(key, this.schema[key], options, object))
                validators[key] = keyValidators
            }
        }
        return validators
    }

    private _getValidatorsForKey(key: any, object?: any, options?: ValidationOptions): any {
        options = typeof options === 'object' ? defaults(options, this.options) : this.options
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
            return result.isValid() ? null : result
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
            return result.isValid() ? null : result
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

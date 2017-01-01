import { ValidationError, ValidationResult } from './interfaces'

export class ComposedValidationResult implements ValidationResult {

    constructor() {
        this.errors = []
    }

    readonly errors: ValidationError[]

    public and(result: ValidationResult | null | ValidationError, key: String | null = null, index: number | null = null): void {
        if (result != null) {
            const prefix = key ? `${key}.` : ''
            const suffix = index !== null ? `.${index}` : ''

            if (result instanceof ComposedValidationResult) {
                for (let error of result.getErrors()) {
                    const property = `${prefix}${error.property}${suffix}`
                    this.errors.push({
                        property: property,
                        rule: error.rule,
                        message: error.message
                    })
                }
            } else if (typeof result === 'object') {
                const error = result as ValidationError
                const property = `${prefix}${error.property}${suffix}`
                this.errors.push({
                    property: property,
                    rule: error.rule,
                    message: error.message
                })
            }
        }
    }

    public isValid() {
        return this.errors.length === 0
    }

    public getErrors(): ValidationError[] {
        return this.errors
    }
}

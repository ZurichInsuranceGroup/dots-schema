import { ValidationError, ValidationResult } from './interfaces'

export class ComposedValidationResult implements ValidationResult {

    constructor() {
        this.valid = true
        this.errors = []
    }

    public valid: Boolean

    readonly errors: ValidationError[]

    public and(result: ValidationResult | null | ValidationError, key: String | null = null): void {
        if (result != null) {
            if (result instanceof ComposedValidationResult) {
                this.valid = this.valid && result.isValid()

                const prefix = key ? `${key}.` : ''
                for (let error of result.getErrors()) {
                    const property = `${prefix}${error.property}`
                    this.errors.push({
                        property: property,
                        rule: error.rule,
                        message: error.message
                    })
                }
            } else if (typeof result === 'object') {
                const error = result as ValidationError
                this.valid = false
                const prefix = key ? `${key}.` : ''
                const property = `${prefix}${error.property}`
                this.errors.push({
                    property: property,
                    rule: error.rule,
                    message: error.message
                })
            }
        }
    }

    public or(result: ValidationResult | null | ValidationError, key: String | null = null): void {
        if (result != null) {
            if (result instanceof ComposedValidationResult) {
                this.valid = result.isValid()

                if (!this.valid) {
                    const prefix = key ? `${key}.` : ''
                    for (let error of result.getErrors()) {
                        const property = `${prefix}${error.property}`
                        this.errors.push({
                            property: property,
                            rule: error.rule,
                            message: error.message
                        })
                    }
                }
            } else if (typeof result === 'object') {
                this.valid = false
                const error = result as ValidationError
                const prefix = key ? `${key}.` : ''
                const property = `${prefix}${error.property}`
                this.errors.push({
                    property: property,
                    rule: error.rule,
                    message: error.message
                })
            }
        }
    }

    public isValid(): Boolean {
        return this.valid
    }

    public getErrors(): ValidationError[] {
        return this.errors
    }

    public getValidityByRule(key: string): any {
        const validity: any = {}
        for (let error of this.getErrors()) {
            if (error.property === key) {
                validity[error.rule] = false
            }
        }

        return validity
    }
}

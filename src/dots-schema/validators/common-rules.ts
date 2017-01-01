import {
    ValidationDefinition,
    ValidationError
}  from '../interfaces'

export function min(value: any, key: string, definition: ValidationDefinition): null | ValidationError {
    if (typeof value === 'number' && typeof definition.min === 'number' && value < definition.min) {
        return {
            property: key,
            rule: 'min',
            message: `Property ${key} must be greater than ${definition.min}`
        }
    } else if (typeof value === 'string' && typeof definition.min === 'number' && value.length < definition.min) {
        return {
            property: key,
            rule: 'min',
            message: `Property ${key} must be shorter than ${definition.min}`
        }
    }
    return null
}

export function max(value: any, key: string, definition: ValidationDefinition): null | ValidationError {
    if (typeof value === 'number' && typeof definition.max === 'number' && value > definition.max) {
        return {
            property: key,
            rule: 'max',
            message: `Property ${key} must be greater than ${definition.max}`
        }
    } else if (typeof value === 'string' && typeof definition.max === 'number' && value.length > definition.max) {
        return {
            property: key,
            rule: 'max',
            message: `Property ${key} must be longer than ${definition.max}`
        }
    }
    return null
}

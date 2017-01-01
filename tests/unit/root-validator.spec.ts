require('app-module-path').addPath(__dirname + '/../../build/module/')


import { expect } from 'chai'

import { Schema, ValidationResult } from 'dots-schema'

describe('RootValidator', () => {

    it('can validate missing values', () => {
        const schema = new Schema({
            string: {
                type: String
            },
            number: {
                type: Number
            },
            date: {
                type: Date
            },
            optional: {
                type: String,
                optional: true
            }
        })

        let result = schema.validate({}) as ValidationResult

        expect(result).not.to.equal(null)
        expect(result.getErrors().length).to.equal(3)

        const stringValidator = schema.getValidators('string', null, { clean: true })
        let error = stringValidator.required('')

        expect(error.property).to.equal('string')
        expect(error.rule).to.equal('required')

        error = stringValidator.required('', null, { clean: false })
        expect(error).to.equal(null)
    })

    it('can validate allowed values', () => {
        const schema = new Schema({
            allowed: {
                type: Number,
                allowedValues: [1, 2, 3]
            }
        })

        let result = schema.validate({
            allowed: 1
        }) as ValidationResult

        expect(result).to.equal(null)

        result = schema.validate({
            allowed: 4
        }) as ValidationResult

        expect(result).not.to.equal(null)
        expect(result.getErrors().length).to.equal(1)
    })

    it('can validate union types', () => {
        const schema = new Schema({
            stringOrNumber: {
                type: [String, Number],
                regEx: Schema.RegEx.Email,
                min: 2
            }
        })

        let result = schema.validate({
            stringOrNumber: 'test@example.com'
        }) as ValidationResult

        expect(result).to.equal(null)

        result = schema.validate({
            stringOrNumber: 2
        }) as ValidationResult

        expect(result).to.equal(null)

        result = schema.validate({
            stringOrNumber: false
        }) as ValidationResult

        expect(result).not.to.equal(null)
        expect(result.getErrors().length).to.equal(1)
    })

    it('can validate an array', () => {
        const schema = new Schema({
            strings: {
                type: String,
                array: true,
                minCount: 2,
                maxCount: 4
            }
        })

        let result = schema.validate({
            strings: ['1', '2']
        }) as ValidationResult

        expect(result).to.equal(null)

        result = schema.validate({
            strings: '1'
        }) as ValidationResult

        expect(result).not.to.equal(null)
        expect(result.getErrors().length).to.equal(2)
        expect(result.getErrors()[0].rule).to.equal('type')

        result = schema.validate({
            strings: ['1']
        }) as ValidationResult

        expect(result).not.to.equal(null)
        expect(result.getErrors().length).to.equal(1)
        expect(result.getErrors()[0].rule).to.equal('minCount')

        result = schema.validate({
            strings: ['1', '2', '3', '4', '5']
        }) as ValidationResult

        expect(result).not.to.equal(null)
        expect(result.getErrors().length).to.equal(1)
        expect(result.getErrors()[0].rule).to.equal('maxCount')

        result = schema.validate({
            strings: ['1', 3, '3', false]
        }) as ValidationResult

        expect(result).not.to.equal(null)
        expect(result.getErrors().length).to.equal(2)
        expect(result.getErrors()[0].rule).to.equal('type')
        expect(result.getErrors()[0].property).to.equal('strings.1')
        expect(result.getErrors()[1].rule).to.equal('type')
        expect(result.getErrors()[1].property).to.equal('strings.3')
    })

})

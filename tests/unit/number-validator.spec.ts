require('app-module-path').addPath(__dirname + '/../../build/module/')

import { expect } from 'chai'

import { Schema, ValidationResult } from 'dots-schema'

describe('NumberValidator', () => {

    it('can validate a number type', () => {
        const schema = new Schema({
            number: {
                type: Number,
                min: 0,
                max: 5
            }
        })

        let result = schema.validate({
            number: 'test'
        }) as ValidationResult

        expect(result.isValid()).to.equal(false)
        expect(result.getErrors().length).to.equal(1)

        let error = result.getErrors()[0]

        expect(error.property).to.equal('number')
        expect(error.rule).to.equal('type')

        result = schema.validate({
            number: 1
        }) as ValidationResult

        expect(result.isValid()).to.equal(true)

        result = schema.validate({
            number: -1
        }) as ValidationResult

        expect(result.isValid()).to.equal(false)
        expect(result.getErrors().length).to.equal(1)
        expect(result.getErrors()[0].rule).to.equal('min')
        expect(result.getErrors()[0].property).to.equal('number')

        result = schema.validate({
            number: 6
        }) as ValidationResult

        expect(result.isValid()).to.equal(false)
        expect(result.getErrors().length).to.equal(1)
        expect(result.getErrors()[0].rule).to.equal('max')
        expect(result.getErrors()[0].property).to.equal('number')

    })

    it('can clean a number', () => {
        const schema = new Schema({
            number: {
                type: Number
            },
            numberRounded: {
                type: Number,
                rounding: 'floor'
            },
            decimal: {
                type: Number,
                decimal: true,
                rounding: 'round'
            }
        })

        let result = schema.clean({
            number: '1.4',
            numberRounded: 1.9,
            decimal: '1.23'
        }, {
            rounding: 'ceil'
        })

        expect(result.number).to.equal(2)
        expect(result.numberRounded).to.equal(1)
        expect(result.decimal).to.equal(1.23)

    })

})

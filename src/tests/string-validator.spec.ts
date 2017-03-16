import { expect } from 'chai'
import moment = require('moment')

import { Schema } from '../dots-schema'

describe('StringValidator', () => {

    it('can validate a string type', () => {
        const schema = new Schema({
            string: {
                type: String,
                min: 1,
                max: 3
            }
        })

        let result = schema.validate({
            string: '123'
        })

        expect(result).to.equal(null)

        result = schema.validate({
            string: 1
        })

        expect(result).not.to.equal(null)
        if (result) {
            expect(result.getErrors().length).to.equal(1)

            let error = result.getErrors()[0]

            expect(error.property).to.equal('string')
            expect(error.rule).to.equal('type')
        }

        result = schema.validate({
            string: ''
        })

        expect(result).not.to.equal(null)
        if (result) {
            expect(result.getErrors().length).to.equal(1)
            expect(result.getErrors()[0].rule).to.equal('min')
            expect(result.getErrors()[0].property).to.equal('string')
        }

        result = schema.validate({
            string: '1234'
        })

        expect(result).not.to.equal(null)
        if (result) {
            expect(result.getErrors().length).to.equal(1)
            expect(result.getErrors()[0].rule).to.equal('max')
            expect(result.getErrors()[0].property).to.equal('string')
        }
    })

    it('can validate using a regex', () => {
        const schema = new Schema({
            string: {
                type: String,
                regEx: Schema.RegEx.Email
            }
        })

        let result = schema.validate({
            string: 'test@example.com'
        })

        expect(result).to.equal(null)

        result = schema.validate({
            string: 'testexample.com'
        })

        expect(result).not.to.equal(null)
        if (result) {
            expect(result.getErrors().length).to.equal(1)
            expect(result.getErrors()[0].rule).to.equal('regEx')
            expect(result.getErrors()[0].property).to.equal('string')
        }
    })

    it('can clean a string', () => {
        const schema = new Schema({
            string: {
                type: String
            },
            stringTrimmed: {
                type: String
            },
            stringEmpty: {
                type: String
            },
            emptyWithDefault: {
                type: String,
                defaultValue: 'default'
            }
        })

        let result = schema.clean({
            string: 1,
            stringTrimmed: '  test     ',
            stringEmpty: '   ',
            emptyWithDefault: '  '
        })

        expect(result.string).to.equal('1')
        expect(result.stringTrimmed).to.equal('test')
        expect(result.stringEmpty).to.equal(null)
        expect(result.emptyWithDefault).to.equal('default')

        const date = new Date()
        result = schema.clean({
            string: date,
            stringTrimmed: '  test     ',
            stringEmpty: '   ',
            emptyWithDefault: '  '
        }, {
                trimStrings: false
            })

        expect(result.string).to.equal(moment(date).format())
        expect(result.stringTrimmed).to.equal('  test     ')
        expect(result.stringEmpty).to.equal(null)
    })

})

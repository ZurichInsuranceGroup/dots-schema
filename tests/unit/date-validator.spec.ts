require('app-module-path').addPath(__dirname + '/../../build/module/')


import * as moment from 'moment'
import { expect } from 'chai'

import { Schema, ValidationResult } from 'dots-schema'

describe('DateValidator', () => {

    it('can validate a date type', () => {
        const schema = new Schema({
            date: {
                type: Date,
                before: new Date(Date.now() + 1000),
                after: new Date(Date.now() - 1000)
            }
        })

        let result = schema.validate({
            date: new Date()
        }) as ValidationResult

        expect(result).to.equal(null)

        result = schema.validate({
            date: 'test'
        }) as ValidationResult

        expect(result.isValid()).to.equal(false)
        expect(result.getErrors().length).to.equal(1)

        let error = result.getErrors()[0]

        expect(error.property).to.equal('date')
        expect(error.rule).to.equal('type')
    })

    it('can clean a date', () => {
        const format = 'MM-DD-YYYY'
        const dateString = '07-25-1987'
        const date = moment(dateString, format).toDate()
        const schema = new Schema({
            date: {
                type: Date,
                dateFormat: format
            }
        })

        let result = schema.clean({
            date: dateString
        })

        expect(result.date.getTime()).to.equal(date.getTime())
    })
})

import { expect } from 'chai'

import { Schema } from '../dots-schema'

describe('BooleanValidator', () => {

    it('can validate a number type', () => {
        const schema = new Schema({
            bool: {
                type: Boolean
            }
        })

        let result = schema.validate({
            bool: false
        })

        expect(result).to.equal(null)

        result = schema.validate({
            bool: 1
        })

        expect(result).not.to.equal(null)
        if (result)  {
            expect(result.getErrors().length).to.equal(1)

            let error = result.getErrors()[0]

            expect(error.property).to.equal('bool')
            expect(error.rule).to.equal('type')

        }
    })

    it('can clean a boolean', () => {
        const schema = new Schema({
            bool: {
                type: Boolean
            },
            bool2: {
                type: Boolean
            },
            bool3: {
                type: Boolean
            },
            bool4: {
                type: Boolean
            }
        })

        let result = schema.clean({
            bool: 'false',
            bool2: 1,
            bool3: null
        })

        expect(result.bool).to.equal(false)
        expect(result.bool2).to.equal(true)
        expect(result.bool3).to.equal(false)
        expect(result.bool4).to.be.an('undefined')

    })

})

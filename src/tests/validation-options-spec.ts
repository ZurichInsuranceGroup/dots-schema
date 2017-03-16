import { expect } from 'chai'

import { Schema } from '../dots-schema'

describe('ValidationOptions', () => {

    it('can forbid extra properties', () => {
        const schema = new Schema({
            string: {
                type: String
            }
        }, {
            allowExtras: false
        })

        let result = schema.validate({
            string: '123',
        })

        expect(result).to.equal(null)

        result = schema.validate({
            string: '123',
            extra: 'extra'
        })

        expect(result).not.to.equal(null)
        if (result) {
            expect(result.getErrors().length).to.equal(1)

            let error = result.getErrors()[0]

            expect(error.property).to.equal('extra')
            expect(error.rule).to.equal('undefined')
        }
    })

})

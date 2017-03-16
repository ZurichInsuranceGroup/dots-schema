import { expect } from 'chai'

import { Schema } from '../dots-schema'

describe('SchemaValidator', () => {

    it('can validate a sub-schema', () => {
        const schema = new Schema({
            sub: {
                type: new Schema({
                    string: {
                        type: String
                    }
                })
            }
        })

        let result = schema.validate({
            sub: {
                string: '1'
            }
        })

        expect(result).to.equal(null)

        result = schema.validate({
            sub: {}
        })

        expect(result).not.to.equal(null)
        if (result)  {
            expect(result.getErrors().length).to.equal(1)
        }
    })

    it('can clean a sub-schema', () => {
        const schema = new Schema({
            sub: {
                type: new Schema({
                    string: {
                        type: String,
                        defaultValue: 'default'
                    }
                }),
                defaultValue: {}
            }
        })

        let result = schema.clean({
            sub: {
                string: 1
            }
        })

        expect(result.sub.string).to.equal('1')

        result = schema.clean({})

        expect(result.sub.string).to.equal('default')
    })

})

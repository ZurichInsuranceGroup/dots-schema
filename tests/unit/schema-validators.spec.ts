require('app-module-path').addPath(__dirname + '/../../build/module/')


import { expect } from 'chai'

import { Schema, ValidationResult } from 'dots-schema'

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
        }) as ValidationResult

        expect(result).to.equal(null)

        result = schema.validate({
            sub: {}
        }) as ValidationResult

        expect(result).not.to.equal(null)
        expect(result.getErrors().length).to.equal(1)
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

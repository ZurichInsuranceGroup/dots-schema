import isEmpty =  require('lodash.isempty')
import { expect } from 'chai'

import { Schema } from '../dots-schema'

describe('Schema', () => {

    it('can validate a simple Object', () => {
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
            },
            allowed: {
                type: Number,
                allowedValues: [1, 2, 3]
            }
        })

        let result = schema.validate({
            string: 'test',
            number: 1,
            date: new Date(),
            allowed: 1
        })

        expect(result).to.equal(null)

        result = schema.validate({
            string: 1,
            number: 'test',
            date: false,
            optional: 5,
            allowed: 4
        })

        expect(result).not.to.equal(null)
        if (result) {
            expect(result.getErrors().length).to.equal(5)
        }
    })

    it('cleans without mutate per default', () => {
        const schema = new Schema({
            string: {
                type: String
            }
        })

        const object = {
            string: 1
        }

        const result = schema.clean(object)

        expect(result.string).to.equal('1')
        expect(object.string).to.equal(1)
    })

    it('can validate with auto cleaning', () => {
        const schema = new Schema({
            string: {
                type: String
            }
        })

        // clean without mutate
        let object = {
            string: 1
        }

        let result = schema.validate(object, {
            autoClean: true
        })

        expect(object.string).to.equal(1)
        expect(result).to.equal(null)

        // clean with mutate
        object = {
            string: 1
        }

        result = schema.validate(object, {
            autoClean: true,
            mutate: true
        })

        expect(object.string).to.equal('1')
        expect(result).to.equal(null)

        // disable clean
        object = {
            string: 1
        }

        result = schema.validate(object, {
            autoClean: false
        })

        expect(object.string).to.equal(1)
        expect(result).not.to.equal(null)
    })

    it('can use custom validators', () => {
        const object = {
            something: 'yo'
        }

        const schema = new Schema({
            something: {
                type: String,
                custom: (value: any, object: any, context: any) => {
                    if (object.something === 'yo') {
                        return 'not valid'
                    }
                    return null
                }
            }
        })

        let result = schema.validate(object)

        expect(result).not.to.equal(null)
        if (result) {
            expect(result.getErrors().length).to.equal(1)
            expect(result.getErrors()[0].rule).to.equal('custom')
            expect(result.getErrors()[0].property).to.equal('something')
            expect(result.getErrors()[0].message).to.equal('not valid')

            const validators = schema.getValidators('something')
            const error = validators.custom(object.something, object)
            expect(error.property).to.equal('something')
            expect(error.rule).to.equal('custom')
        }

        const parentSchema = new Schema({
            child: {
                type: schema
            }
        })

        const parent = {
            child: object
        }

        result = parentSchema.validate(parent)

        expect(result).not.to.equal(null)
        if (result) {
            expect(result.getErrors().length).to.equal(1)
            expect(result.getErrors()[0].property).to.equal('child.something')
        }

    })

    it('can use custom validator objects', () => {
        const object = {
            something: 'yo'
        }

        let schema = new Schema({
            something: {
                type: String,
                custom: {
                    custom1: (value: any, object: any, context: any) => {
                        expect(value).to.equal('yo')
                        expect(object).to.equal(object)
                        expect(isEmpty(context)).to.equal(true)
                        return '1'
                    },
                    custom2: (value: any, object: any, context: any) => {
                        expect(value).to.equal('yo')
                        expect(object).to.equal(object)
                        expect(isEmpty(context)).to.equal(true)
                        return '2'
                    }
                }
            }
        })

        let result = schema.validate(object)

        expect(result).not.to.equal(null)
        if (result) {
            expect(result.getErrors().length).to.equal(2)
            expect(result.getErrors()[0].rule).to.equal('custom1')
            expect(result.getErrors()[0].property).to.equal('something')
            expect(result.getErrors()[0].message).to.equal('1')
            expect(result.getErrors()[1].rule).to.equal('custom2')
            expect(result.getErrors()[1].property).to.equal('something')
            expect(result.getErrors()[1].message).to.equal('2')
        }


        schema = new Schema({
            something: {
                type: String,
                custom: {
                    custom1: (value: any, object: any, context: any) => {
                        expect(value).to.equal('yo')
                        expect(object).to.equal(object)
                        return context === 1 ? null : 'missing context'
                    }
                }
            }
        })
        let validators = schema.getValidators('something')
        let error = validators.custom1(object.something, object)
        expect(error.property).to.equal('something')
        expect(error.rule).to.equal('custom1')

        error = validators.custom1(object.something, object, {
            context: 1
        })
        expect(error).to.equal(null)

        schema = new Schema({
            something: {
                type: String,
                custom: {
                    custom1: (value: any, object: any, context: any) => {
                        expect(value).to.equal('yo')
                        expect(object).to.equal(object)
                        return context === 1 ? null : 'missing context'
                    }
                }
            }
        })
        validators = schema.getValidators(object, {
            context: 1
        })

        error = validators.something.custom1(object.something)
        expect(error).to.equal(null)
    })

    it('can validate single keys', () => {
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
            },
            allowed: {
                type: Number,
                allowedValues: [1, 2, 3]
            }
        })

        let result = schema.validate({
            string: 'test',
            number: 1,
            date: new Date(),
            allowed: 1
        }, 'string')

        expect(result).to.equal(null)

        result = schema.validate({
            string: 1,
            number: 'test',
            date: false,
            optional: 5,
            allowed: 4
        }, 'string')

        expect(result).not.to.equal(null)
        if (result) {
            expect(result.getErrors().length).to.equal(1)
        }
    })

    it('can create a set of validators', () => {
        const schema = new Schema({
            string: {
                type: String,
                max: 5
            },
            number: {
                type: Number,
                min: 3
            },
            date: {
                type: Date
            },
            optional: {
                type: String,
                optional: true
            },
            allowed: {
                type: Number,
                allowedValues: [1, 2, 3]
            }
        })

        const validators = schema.getValidators()

        expect(Object.keys(validators).length).to.equal(5)
        expect(Object.keys(validators.string).length).to.equal(3)

        expect(validators.string.type).to.be.a('function')
        expect(validators.string.required).to.be.a('function')
        expect(validators.string.max).to.be.a('function')

        expect(validators.number.type).to.be.a('function')
        expect(validators.number.required).to.be.a('function')

        expect(validators.date.type).to.be.a('function')
        expect(validators.date.required).to.be.a('function')

        expect(Object.keys(validators.optional).length).to.equal(1)
        expect(validators.optional.type).to.be.a('function')

        expect(Object.keys(validators.allowed).length).to.equal(3)
        expect(validators.allowed.type).to.be.a('function')
        expect(validators.allowed.required).to.be.a('function')
        expect(validators.allowed.allowedValues).to.be.a('function')

        const fieldValidators = schema.getValidators('string')

        expect(Object.keys(fieldValidators).length).to.equal(3)
        expect(fieldValidators.type).to.be.a('function')
        expect(fieldValidators.required).to.be.a('function')
    })
})

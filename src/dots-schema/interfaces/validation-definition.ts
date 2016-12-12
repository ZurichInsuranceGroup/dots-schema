import { Schema } from '../schema'

export type DefinitionType = { new (...args: any[]) : any } | Schema | any

export interface ValidationDefinition {

    type: DefinitionType | DefinitionType[]

    label?: String

    array?: boolean

    minCount?: Number

    maxCount?: Number

    allowedValues?: any[]

    regEx?: RegExp

    optional?: Boolean

    min?: Number

    max?: Number

    trim?: Boolean

    removeEmpty?: Boolean

    decimal?: Boolean

    rounding?: 'round' | 'floor' | 'ceil'

    dateFormat?: String

    before?: Date

    after?: Date

    custom?: any

    autoValue?: Function

    defaultValue?: Function
}

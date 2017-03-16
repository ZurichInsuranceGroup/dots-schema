/// <reference types="lodash" />
import { Schema } from '../schema';
export declare type DefinitionType = {
    new (...args: any[]): any;
} | Schema | any;
export interface ValidationDefinition {
    type: DefinitionType | DefinitionType[];
    label?: String;
    collectionType?: false | Array<any> | Map<any, any> | Set<any> | WeakSet<any>;
    array?: boolean;
    minCount?: Number;
    maxCount?: Number;
    allowedValues?: any[];
    regEx?: RegExp;
    optional?: Boolean;
    min?: Number;
    max?: Number;
    trim?: Boolean;
    removeEmpty?: Boolean;
    decimal?: Boolean;
    rounding?: 'round' | 'floor' | 'ceil';
    dateFormat?: String;
    before?: Date;
    after?: Date;
    custom?: any;
    autoValue?: Function;
    defaultValue?: Function;
}

import isArray from 'lodash.isarray';
import union from 'lodash.union';
import isEmpty from 'lodash.isempty';
import isDate from 'lodash.isdate';
import reverse from 'lodash.reverse';
import cloneDeep from 'lodash.clonedeep';
import { ComposedValidationResult } from '../composed-validation-result';
import { StringValidator } from './string-validator';
import { NumberValidator } from './number-validator';
import { DateValidator } from './date-validator';
import { ObjectValidator } from './object-validator';
import { SchemaValidator } from './schema-validator';
import { BooleanValidator } from './boolean-validator';
import { Schema } from '../schema';
import { cleaned } from '../cleaned';
var RootValidator = (function () {
    function RootValidator() {
    }
    // for the type rule, the value is valid if at least one type is valid
    RootValidator.createTypeValidator = function (key, types, validatorsByType) {
        return function (value, object, options) {
            for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                var type = types_1[_i];
                var validator = validatorsByType[type.name].type;
                if (validator(value, object, options) === null) {
                    return null;
                }
            }
            return {
                property: key,
                rule: 'type',
                message: "Property " + key + " must be one of [" + Object.keys(validatorsByType).join(', ') + "]"
            };
        };
    };
    // every other rule gets passed down to every typeValidator that supports the rule
    RootValidator.createRuleValidator = function (rule, types, validatorsByType) {
        return function (value, object, options) {
            for (var _i = 0, types_2 = types; _i < types_2.length; _i++) {
                var type = types_2[_i];
                var validator = validatorsByType[type.name][rule];
                if (typeof validator === 'function') {
                    return validator(value, object, options);
                }
            }
            return null;
        };
    };
    RootValidator.createArrayValidator = function (validator, key) {
        return function (value, object, options) {
            if (isArray(value)) {
                var result = new ComposedValidationResult();
                for (var index = 0; index < value.length; index++) {
                    result.and(validator(value[index], object, options), null, index);
                }
                return result;
            }
            return null;
        };
    };
    RootValidator.getValidatorsForKey = function (key, definition, options, object) {
        var validators = {};
        if (!definition.optional) {
            validators.required = cleaned(RootValidator.RULES.required, key, definition, options);
        }
        if (definition.allowedValues) {
            validators.allowedValues = cleaned(RootValidator.RULES.allowedValues, key, definition, options);
        }
        if (definition.array) {
            validators.isArray = cleaned(RootValidator.RULES.isArray, key, definition, options);
        }
        if (typeof definition.minCount !== 'undefined') {
            validators.minCount = cleaned(RootValidator.RULES.minCount, key, definition, options);
        }
        if (typeof definition.maxCount !== 'undefined') {
            validators.maxCount = cleaned(RootValidator.RULES.maxCount, key, definition, options);
        }
        if (definition.custom) {
            if (typeof definition.custom === 'function') {
                validators.custom = cleaned(RootValidator.RULES.custom, key, definition, options, object, definition.custom, 'custom');
            }
            else if (typeof definition.custom === 'object') {
                for (var rule in definition.custom) {
                    if (definition.custom.hasOwnProperty(rule)) {
                        validators[rule] = cleaned(RootValidator.RULES.custom, key, definition, options, object, definition.custom[rule], rule);
                    }
                }
            }
        }
        var types = isArray(definition.type) ? definition.type : [definition.type];
        var validatorsByType = {};
        var rules = [];
        for (var _i = 0, types_3 = types; _i < types_3.length; _i++) {
            var type = types_3[_i];
            var validators_1 = this.getValidator(type).getValidatorsForKey(key, definition, options, object);
            validatorsByType[type.name] = validators_1;
            rules = union(rules, Object.keys(validators_1));
        }
        if (definition.array) {
            for (var _a = 0, rules_1 = rules; _a < rules_1.length; _a++) {
                var rule = rules_1[_a];
                validators[rule] = rule === 'type' ?
                    RootValidator.createArrayValidator(RootValidator.createTypeValidator(key, types, validatorsByType), key) :
                    RootValidator.createArrayValidator(RootValidator.createRuleValidator(rule, types, validatorsByType), key);
            }
        }
        else {
            for (var _b = 0, rules_2 = rules; _b < rules_2.length; _b++) {
                var rule = rules_2[_b];
                validators[rule] = rule === 'type' ?
                    RootValidator.createTypeValidator(key, types, validatorsByType) :
                    RootValidator.createRuleValidator(rule, types, validatorsByType);
            }
        }
        return validators;
    };
    RootValidator.getValidator = function (type) {
        switch (type) {
            case String:
                return StringValidator;
            case Number:
                return NumberValidator;
            case Date:
                return DateValidator;
            case Object:
                return ObjectValidator;
            case Boolean:
                return BooleanValidator;
            default:
                if (type instanceof Schema) {
                    return SchemaValidator;
                }
                else {
                    throw new Error("Unkown type " + type + " used in schema");
                }
        }
    };
    RootValidator.clean = function (definition, value, options, object) {
        var result = value;
        if (options.removeEmptyStrings && typeof result === 'string' && value.trim().length === 0) {
            if (definition.removeEmpty !== false) {
                result = null;
            }
        }
        else if (options.removeEmptyObjects && typeof result === 'object' && isEmpty(result) && !isDate(result)) {
            if (definition.removeEmpty !== false) {
                result = null;
            }
        }
        var types = Array.isArray(definition.type) ? definition.type : [definition.type];
        if (typeof result === 'undefined' || result == null) {
            if (typeof definition.defaultValue !== 'undefined') {
                result = cloneDeep(definition.defaultValue);
            }
        }
        if (typeof definition.autoValue === 'function') {
            result = definition.autoValue(result, object);
        }
        for (var _i = 0, _a = reverse(types); _i < _a.length; _i++) {
            var type = _a[_i];
            result = RootValidator.getValidator(type).clean(definition, result, options, object);
        }
        return result;
    };
    return RootValidator;
}());
export { RootValidator };
RootValidator.RULES = {
    isArray: function (value, key, definition) {
        if ((typeof value !== 'undefined' && value !== null) && !Array.isArray(value)) {
            return {
                property: key,
                rule: 'type',
                message: "Property " + key + " expected to be an array of type " + definition.type.name
            };
        }
        return null;
    },
    minCount: function (value, key, definition) {
        if ((typeof value !== 'undefined' && value !== null) && (typeof definition.minCount === 'number') && value.length < definition.minCount) {
            return {
                property: key,
                rule: 'minCount',
                message: "Property " + key + " expected to be an array of type " + definition.type.name + " with at least " + definition.minCount + " elements"
            };
        }
        return null;
    },
    maxCount: function (value, key, definition) {
        if ((typeof value !== 'undefined' && value !== null) && (typeof definition.maxCount === 'number') && value.length > definition.maxCount) {
            return {
                property: key,
                rule: 'maxCount',
                message: "Property " + key + " expected to be an array of type " + definition.type.name + " with at max " + definition.maxCount + " elements"
            };
        }
        return null;
    },
    required: function (value, key, definition) {
        if (!definition.optional && (typeof value === 'undefined' || value == null)) {
            return {
                property: key,
                rule: 'required',
                message: "Missing value for property " + key
            };
        }
        return null;
    },
    allowedValues: function (value, key, definition) {
        if ((typeof value !== 'undefined' && value !== null) && typeof definition.allowedValues !== 'undefined') {
            if (definition.allowedValues.indexOf(value) === -1) {
                return {
                    property: key,
                    rule: 'allowedValues',
                    message: "Value of " + key + " is not in allowedValues"
                };
            }
        }
        return null;
    },
    custom: function (value, key, defintion, object, options, custom, rule) {
        var error = custom(value, object, options.context);
        if (typeof error === 'string') {
            return {
                property: key,
                rule: rule,
                message: error
            };
        }
        return null;
    }
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kb3RzLXNjaGVtYS92YWxpZGF0b3JzL3Jvb3QtdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sT0FBTyxNQUFNLGdCQUFnQixDQUFBO0FBQ3BDLE9BQU8sS0FBSyxNQUFNLGNBQWMsQ0FBQTtBQUNoQyxPQUFPLE9BQU8sTUFBTSxnQkFBZ0IsQ0FBQTtBQUNwQyxPQUFPLE1BQU0sTUFBTSxlQUFlLENBQUE7QUFDbEMsT0FBTyxPQUFPLE1BQU0sZ0JBQWdCLENBQUE7QUFDcEMsT0FBTyxTQUFTLE1BQU0sa0JBQWtCLENBQUE7QUFTeEMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUE7QUFDeEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ3BELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUNwRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUE7QUFDaEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ3BELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUNwRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQTtBQUN0RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sV0FBVyxDQUFBO0FBQ2xDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUE7QUFFcEM7SUFBQTtJQXdPQSxDQUFDO0lBbEtHLHNFQUFzRTtJQUN2RCxpQ0FBbUIsR0FBbEMsVUFBbUMsR0FBVyxFQUFFLEtBQWlCLEVBQUUsZ0JBQXFCO1FBQ3BGLE1BQU0sQ0FBQyxVQUFDLEtBQVUsRUFBRSxNQUFZLEVBQUUsT0FBMkI7WUFDekQsR0FBRyxDQUFDLENBQWEsVUFBSyxFQUFMLGVBQUssRUFBTCxtQkFBSyxFQUFMLElBQUs7Z0JBQWpCLElBQUksSUFBSSxjQUFBO2dCQUNULElB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LENBQUM7WUFDNUIsTUFBTSxDQUFDO2dCQUNILFFBQVEsRUFBRSxHQUFHO2dCQUNiLElBQUksRUFBRSxJQUFJO2dCQUNWLE9BQU8sRUFBRSxLQUFLO2FBQ2pCLENBQUE7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNmLENBQUM7Q0FDSixDQUFBIiwiZmlsZSI6InZhbGlkYXRvcnMvcm9vdC12YWxpZGF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaXNBcnJheSBmcm9tICdsb2Rhc2guaXNhcnJheSdcbmltcG9ydCB1bmlvbiBmcm9tICdsb2Rhc2gudW5pb24nXG5pbXBvcnQgaXNFbXB0eSBmcm9tICdsb2Rhc2guaXNlbXB0eSdcbmltcG9ydCBpc0RhdGUgZnJvbSAnbG9kYXNoLmlzZGF0ZSdcbmltcG9ydCByZXZlcnNlIGZyb20gJ2xvZGFzaC5yZXZlcnNlJ1xuaW1wb3J0IGNsb25lRGVlcCBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJ1xuXG5pbXBvcnQge1xuICAgIFZhbGlkYXRpb25EZWZpbml0aW9uLFxuICAgIERlZmluaXRpb25UeXBlLFxuICAgIFZhbGlkYXRpb25SZXN1bHQsXG4gICAgVmFsaWRhdGlvbk9wdGlvbnMsXG4gICAgVmFsaWRhdGlvbkVycm9yXG59IGZyb20gJy4uL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBDb21wb3NlZFZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICcuLi9jb21wb3NlZC12YWxpZGF0aW9uLXJlc3VsdCdcbmltcG9ydCB7IFN0cmluZ1ZhbGlkYXRvciB9IGZyb20gJy4vc3RyaW5nLXZhbGlkYXRvcidcbmltcG9ydCB7IE51bWJlclZhbGlkYXRvciB9IGZyb20gJy4vbnVtYmVyLXZhbGlkYXRvcidcbmltcG9ydCB7IERhdGVWYWxpZGF0b3IgfSBmcm9tICcuL2RhdGUtdmFsaWRhdG9yJ1xuaW1wb3J0IHsgT2JqZWN0VmFsaWRhdG9yIH0gZnJvbSAnLi9vYmplY3QtdmFsaWRhdG9yJ1xuaW1wb3J0IHsgU2NoZW1hVmFsaWRhdG9yIH0gZnJvbSAnLi9zY2hlbWEtdmFsaWRhdG9yJ1xuaW1wb3J0IHsgQm9vbGVhblZhbGlkYXRvciB9IGZyb20gJy4vYm9vbGVhbi12YWxpZGF0b3InXG5pbXBvcnQgeyBTY2hlbWEgfSBmcm9tICcuLi9zY2hlbWEnXG5pbXBvcnQgeyBjbGVhbmVkIH0gZnJvbSAnLi4vY2xlYW5lZCdcblxuZXhwb3J0IGNsYXNzIFJvb3RWYWxpZGF0b3Ige1xuXG4gICAgcHVibGljIHN0YXRpYyBSVUxFUyA9IHtcbiAgICAgICAgaXNBcnJheTogKHZhbHVlOiBhbnksIGtleTogc3RyaW5nLCBkZWZpbml0aW9uOiBWYWxpZGF0aW9uRGVmaW5pdGlvbik6IFZhbGlkYXRpb25FcnJvciB8IG51bGwgPT4ge1xuICAgICAgICAgICAgaWYgKCh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlICE9PSBudWxsKSAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eToga2V5LFxuICAgICAgICAgICAgICAgICAgICBydWxlOiAndHlwZScsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBQcm9wZXJ0eSAke2tleX0gZXhwZWN0ZWQgdG8gYmUgYW4gYXJyYXkgb2YgdHlwZSAke2RlZmluaXRpb24udHlwZS5uYW1lfWBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9LFxuICAgICAgICBtaW5Db3VudDogKHZhbHVlOiBhbnksIGtleTogc3RyaW5nLCBkZWZpbml0aW9uOiBWYWxpZGF0aW9uRGVmaW5pdGlvbik6IFZhbGlkYXRpb25FcnJvciB8IG51bGwgPT4ge1xuICAgICAgICAgICAgaWYgKCh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlICE9PSBudWxsKSAmJiAodHlwZW9mIGRlZmluaXRpb24ubWluQ291bnQgPT09ICdudW1iZXInKSAmJiB2YWx1ZS5sZW5ndGggPCBkZWZpbml0aW9uLm1pbkNvdW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgcnVsZTogJ21pbkNvdW50JyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFByb3BlcnR5ICR7a2V5fSBleHBlY3RlZCB0byBiZSBhbiBhcnJheSBvZiB0eXBlICR7ZGVmaW5pdGlvbi50eXBlLm5hbWV9IHdpdGggYXQgbGVhc3QgJHtkZWZpbml0aW9uLm1pbkNvdW50fSBlbGVtZW50c2BcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIG1heENvdW50OiAodmFsdWU6IGFueSwga2V5OiBzdHJpbmcsIGRlZmluaXRpb246IFZhbGlkYXRpb25EZWZpbml0aW9uKTogVmFsaWRhdGlvbkVycm9yIHwgbnVsbCA9PiB7XG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgIT09IG51bGwpICYmICh0eXBlb2YgZGVmaW5pdGlvbi5tYXhDb3VudCA9PT0gJ251bWJlcicpICYmIHZhbHVlLmxlbmd0aCA+IGRlZmluaXRpb24ubWF4Q291bnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eToga2V5LFxuICAgICAgICAgICAgICAgICAgICBydWxlOiAnbWF4Q291bnQnLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgUHJvcGVydHkgJHtrZXl9IGV4cGVjdGVkIHRvIGJlIGFuIGFycmF5IG9mIHR5cGUgJHtkZWZpbml0aW9uLnR5cGUubmFtZX0gd2l0aCBhdCBtYXggJHtkZWZpbml0aW9uLm1heENvdW50fSBlbGVtZW50c2BcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9LFxuICAgICAgICByZXF1aXJlZDogKHZhbHVlOiBhbnksIGtleTogc3RyaW5nLCBkZWZpbml0aW9uOiBWYWxpZGF0aW9uRGVmaW5pdGlvbik6IFZhbGlkYXRpb25FcnJvciB8IG51bGwgPT4ge1xuICAgICAgICAgICAgaWYgKCFkZWZpbml0aW9uLm9wdGlvbmFsICYmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHZhbHVlID09IG51bGwpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgcnVsZTogJ3JlcXVpcmVkJyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYE1pc3NpbmcgdmFsdWUgZm9yIHByb3BlcnR5ICR7a2V5fWBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9LFxuICAgICAgICBhbGxvd2VkVmFsdWVzOiAodmFsdWU6IGFueSwga2V5OiBzdHJpbmcsIGRlZmluaXRpb246IFZhbGlkYXRpb25EZWZpbml0aW9uKTogVmFsaWRhdGlvbkVycm9yIHwgbnVsbCA9PiB7XG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgIT09IG51bGwpICYmIHR5cGVvZiBkZWZpbml0aW9uLmFsbG93ZWRWYWx1ZXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRlZmluaXRpb24uYWxsb3dlZFZhbHVlcy5pbmRleE9mKHZhbHVlKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICBydWxlOiAnYWxsb3dlZFZhbHVlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgVmFsdWUgb2YgJHtrZXl9IGlzIG5vdCBpbiBhbGxvd2VkVmFsdWVzYFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgY3VzdG9tOiAodmFsdWU6IGFueSwga2V5OiBzdHJpbmcsIGRlZmludGlvbjogVmFsaWRhdGlvbkRlZmluaXRpb24sIG9iamVjdDogYW55LCBvcHRpb25zOiBWYWxpZGF0aW9uT3B0aW9ucywgY3VzdG9tOiBGdW5jdGlvbiwgcnVsZTogc3RyaW5nKTogVmFsaWRhdGlvbkVycm9yIHwgbnVsbCA9PiB7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IGN1c3RvbSh2YWx1ZSwgb2JqZWN0LCBvcHRpb25zLmNvbnRleHQpXG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgcnVsZTogcnVsZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZm9yIHRoZSB0eXBlIHJ1bGUsIHRoZSB2YWx1ZSBpcyB2YWxpZCBpZiBhdCBsZWFzdCBvbmUgdHlwZSBpcyB2YWxpZFxuICAgIHByaXZhdGUgc3RhdGljIGNyZWF0ZVR5cGVWYWxpZGF0b3Ioa2V5OiBzdHJpbmcsIHR5cGVzOiBGdW5jdGlvbltdLCB2YWxpZGF0b3JzQnlUeXBlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuICh2YWx1ZTogYW55LCBvYmplY3Q/OiBhbnksIG9wdGlvbnM/OiBWYWxpZGF0aW9uT3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgdHlwZSBvZiB0eXBlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkYXRvciA9IHZhbGlkYXRvcnNCeVR5cGVbKHR5cGUgYXMgYW55KS5uYW1lXS50eXBlXG4gICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvcih2YWx1ZSwgb2JqZWN0LCBvcHRpb25zKSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHk6IGtleSxcbiAgICAgICAgICAgICAgICBydWxlOiAndHlwZScsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYFByb3BlcnR5ICR7a2V5fSBtdXN0IGJlIG9uZSBvZiBbJHtPYmplY3Qua2V5cyh2YWxpZGF0b3JzQnlUeXBlKS5qb2luKCcsICcpfV1gXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBldmVyeSBvdGhlciBydWxlIGdldHMgcGFzc2VkIGRvd24gdG8gZXZlcnkgdHlwZVZhbGlkYXRvciB0aGF0IHN1cHBvcnRzIHRoZSBydWxlXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlUnVsZVZhbGlkYXRvcihydWxlOiBzdHJpbmcsIHR5cGVzOiBGdW5jdGlvbltdLCB2YWxpZGF0b3JzQnlUeXBlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuICh2YWx1ZTogYW55LCBvYmplY3Q/OiBhbnksIG9wdGlvbnM/OiBWYWxpZGF0aW9uT3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgdHlwZSBvZiB0eXBlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkYXRvciA9IHZhbGlkYXRvcnNCeVR5cGVbKHR5cGUgYXMgYW55KS5uYW1lXVtydWxlXVxuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRvcih2YWx1ZSwgb2JqZWN0LCBvcHRpb25zKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVBcnJheVZhbGlkYXRvcih2YWxpZGF0b3I6ICh2YWx1ZTogYW55LCBvYmplY3Q/OiBhbnksIG9wdGlvbnM/OiBWYWxpZGF0aW9uT3B0aW9ucykgPT4gYW55LCBrZXk6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gKHZhbHVlOiBhbnksIG9iamVjdD86IGFueSwgb3B0aW9ucz86IFZhbGlkYXRpb25PcHRpb25zKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgQ29tcG9zZWRWYWxpZGF0aW9uUmVzdWx0KClcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hbmQodmFsaWRhdG9yKHZhbHVlW2luZGV4XSwgb2JqZWN0LCBvcHRpb25zKSwgbnVsbCwgaW5kZXgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldFZhbGlkYXRvcnNGb3JLZXkoa2V5OiBzdHJpbmcsIGRlZmluaXRpb246IFZhbGlkYXRpb25EZWZpbml0aW9uLCBvcHRpb25zOiBWYWxpZGF0aW9uT3B0aW9ucywgb2JqZWN0PzogYW55KSB7XG4gICAgICAgIGNvbnN0IHZhbGlkYXRvcnM6IGFueSA9IHt9XG5cbiAgICAgICAgaWYgKCFkZWZpbml0aW9uLm9wdGlvbmFsKSB7XG4gICAgICAgICAgICB2YWxpZGF0b3JzLnJlcXVpcmVkID0gY2xlYW5lZChSb290VmFsaWRhdG9yLlJVTEVTLnJlcXVpcmVkLCBrZXksIGRlZmluaXRpb24sIG9wdGlvbnMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVmaW5pdGlvbi5hbGxvd2VkVmFsdWVzKSB7XG4gICAgICAgICAgICB2YWxpZGF0b3JzLmFsbG93ZWRWYWx1ZXMgPSBjbGVhbmVkKFJvb3RWYWxpZGF0b3IuUlVMRVMuYWxsb3dlZFZhbHVlcywga2V5LCBkZWZpbml0aW9uLCBvcHRpb25zKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlZmluaXRpb24uYXJyYXkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRvcnMuaXNBcnJheSA9IGNsZWFuZWQoUm9vdFZhbGlkYXRvci5SVUxFUy5pc0FycmF5LCBrZXksIGRlZmluaXRpb24sIG9wdGlvbnMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGRlZmluaXRpb24ubWluQ291bnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YWxpZGF0b3JzLm1pbkNvdW50ID0gY2xlYW5lZChSb290VmFsaWRhdG9yLlJVTEVTLm1pbkNvdW50LCBrZXksIGRlZmluaXRpb24sIG9wdGlvbnMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGRlZmluaXRpb24ubWF4Q291bnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YWxpZGF0b3JzLm1heENvdW50ID0gY2xlYW5lZChSb290VmFsaWRhdG9yLlJVTEVTLm1heENvdW50LCBrZXksIGRlZmluaXRpb24sIG9wdGlvbnMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVmaW5pdGlvbi5jdXN0b20pICB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlZmluaXRpb24uY3VzdG9tID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdG9ycy5jdXN0b20gPSBjbGVhbmVkKFJvb3RWYWxpZGF0b3IuUlVMRVMuY3VzdG9tLCBrZXksIGRlZmluaXRpb24sIG9wdGlvbnMsIG9iamVjdCwgZGVmaW5pdGlvbi5jdXN0b20sICdjdXN0b20nKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5pdGlvbi5jdXN0b20gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcnVsZSBpbiBkZWZpbml0aW9uLmN1c3RvbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVmaW5pdGlvbi5jdXN0b20uaGFzT3duUHJvcGVydHkocnVsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvcnNbcnVsZV0gPSBjbGVhbmVkKFJvb3RWYWxpZGF0b3IuUlVMRVMuY3VzdG9tLCBrZXksIGRlZmluaXRpb24sIG9wdGlvbnMsIG9iamVjdCwgZGVmaW5pdGlvbi5jdXN0b21bcnVsZV0sIHJ1bGUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IHR5cGVzID0gaXNBcnJheTxEZWZpbml0aW9uVHlwZT4oZGVmaW5pdGlvbi50eXBlKSA/IGRlZmluaXRpb24udHlwZSA6IFtkZWZpbml0aW9uLnR5cGVdXG5cbiAgICAgICAgY29uc3QgdmFsaWRhdG9yc0J5VHlwZTogYW55ID0ge31cbiAgICAgICAgbGV0IHJ1bGVzOiBhbnlbXSA9IFtdXG5cbiAgICAgICAgZm9yIChsZXQgdHlwZSBvZiB0eXBlcykge1xuICAgICAgICAgICAgY29uc3QgdmFsaWRhdG9ycyA9IHRoaXMuZ2V0VmFsaWRhdG9yKHR5cGUpLmdldFZhbGlkYXRvcnNGb3JLZXkoa2V5LCBkZWZpbml0aW9uLCBvcHRpb25zLCBvYmplY3QpXG4gICAgICAgICAgICB2YWxpZGF0b3JzQnlUeXBlW3R5cGUubmFtZV0gPSB2YWxpZGF0b3JzXG4gICAgICAgICAgICBydWxlcyA9IHVuaW9uKHJ1bGVzLCBPYmplY3Qua2V5cyh2YWxpZGF0b3JzKSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkZWZpbml0aW9uLmFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBydWxlIG9mIHJ1bGVzKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yc1tydWxlXSA9IHJ1bGUgPT09ICd0eXBlJyA/XG4gICAgICAgICAgICAgICAgICAgIFJvb3RWYWxpZGF0b3IuY3JlYXRlQXJyYXlWYWxpZGF0b3IoUm9vdFZhbGlkYXRvci5jcmVhdGVUeXBlVmFsaWRhdG9yKGtleSwgdHlwZXMsIHZhbGlkYXRvcnNCeVR5cGUpLCBrZXkpIDpcbiAgICAgICAgICAgICAgICAgICAgUm9vdFZhbGlkYXRvci5jcmVhdGVBcnJheVZhbGlkYXRvcihSb290VmFsaWRhdG9yLmNyZWF0ZVJ1bGVWYWxpZGF0b3IocnVsZSwgdHlwZXMsIHZhbGlkYXRvcnNCeVR5cGUpLCBrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBydWxlIG9mIHJ1bGVzKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yc1tydWxlXSA9IHJ1bGUgPT09ICd0eXBlJyA/XG4gICAgICAgICAgICAgICAgICAgIFJvb3RWYWxpZGF0b3IuY3JlYXRlVHlwZVZhbGlkYXRvcihrZXksIHR5cGVzLCB2YWxpZGF0b3JzQnlUeXBlKSA6XG4gICAgICAgICAgICAgICAgICAgIFJvb3RWYWxpZGF0b3IuY3JlYXRlUnVsZVZhbGlkYXRvcihydWxlLCB0eXBlcywgdmFsaWRhdG9yc0J5VHlwZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWxpZGF0b3JzXG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRWYWxpZGF0b3IodHlwZTogRGVmaW5pdGlvblR5cGUpOiB7XG4gICAgICAgICAgICBnZXRWYWxpZGF0b3JzRm9yS2V5OiAoa2V5OiBzdHJpbmcsIGRlZmluaXRpb246IFZhbGlkYXRpb25EZWZpbml0aW9uLCBvcHRpb25zOiBWYWxpZGF0aW9uT3B0aW9ucywgb2JqZWN0OiBhbnkpID0+IGFueSxcbiAgICAgICAgICAgIGNsZWFuOiAoZGVmaW5pdGlvbjogVmFsaWRhdGlvbkRlZmluaXRpb24sIHZhbHVlOiBhbnksIG9wdGlvbnM6IFZhbGlkYXRpb25PcHRpb25zLCBvYmplY3Q6IGFueSkgPT4gYW55XG4gICAgfSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBTdHJpbmc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZ1ZhbGlkYXRvclxuICAgICAgICAgICAgY2FzZSBOdW1iZXI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlclZhbGlkYXRvclxuICAgICAgICAgICAgY2FzZSBEYXRlOlxuICAgICAgICAgICAgICAgIHJldHVybiBEYXRlVmFsaWRhdG9yXG4gICAgICAgICAgICBjYXNlIE9iamVjdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0VmFsaWRhdG9yXG4gICAgICAgICAgICBjYXNlIEJvb2xlYW46XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJvb2xlYW5WYWxpZGF0b3JcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgaW5zdGFuY2VvZiBTY2hlbWEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNjaGVtYVZhbGlkYXRvclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rb3duIHR5cGUgJHt0eXBlfSB1c2VkIGluIHNjaGVtYWApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjbGVhbihkZWZpbml0aW9uOiBWYWxpZGF0aW9uRGVmaW5pdGlvbiwgdmFsdWU6IGFueSwgb3B0aW9uczogVmFsaWRhdGlvbk9wdGlvbnMsIG9iamVjdDogYW55KTogYW55IHtcbiAgICAgICAgbGV0IHJlc3VsdDogYW55ID0gdmFsdWVcblxuICAgICAgICBpZiAob3B0aW9ucy5yZW1vdmVFbXB0eVN0cmluZ3MgJiYgdHlwZW9mIHJlc3VsdCA9PT0gJ3N0cmluZycgJiYgdmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKGRlZmluaXRpb24ucmVtb3ZlRW1wdHkgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMucmVtb3ZlRW1wdHlPYmplY3RzICYmIHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnICYmIGlzRW1wdHkocmVzdWx0KSAmJiAhaXNEYXRlKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIGlmIChkZWZpbml0aW9uLnJlbW92ZUVtcHR5ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0eXBlczogRGVmaW5pdGlvblR5cGVbXSA9IEFycmF5LmlzQXJyYXkoZGVmaW5pdGlvbi50eXBlKSA/IChkZWZpbml0aW9uLnR5cGUgYXMgRGVmaW5pdGlvblR5cGVbXSkgOiBbZGVmaW5pdGlvbi50eXBlIGFzIERlZmluaXRpb25UeXBlXVxuXG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAndW5kZWZpbmVkJyB8fCByZXN1bHQgPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkZWZpbml0aW9uLmRlZmF1bHRWYWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBjbG9uZURlZXAoZGVmaW5pdGlvbi5kZWZhdWx0VmFsdWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGRlZmluaXRpb24uYXV0b1ZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBkZWZpbml0aW9uLmF1dG9WYWx1ZShyZXN1bHQsIG9iamVjdClcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHR5cGUgb2YgcmV2ZXJzZSh0eXBlcykgYXMgRGVmaW5pdGlvblR5cGVbXSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gUm9vdFZhbGlkYXRvci5nZXRWYWxpZGF0b3IodHlwZSkuY2xlYW4oZGVmaW5pdGlvbiwgcmVzdWx0LCBvcHRpb25zLCBvYmplY3QpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxufVxuIl19

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9kb3RzLXNjaGVtYS92YWxpZGF0b3JzL3Jvb3QtdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sT0FBTyxNQUFNLGdCQUFnQixDQUFBO0FBQ3BDLE9BQU8sS0FBSyxNQUFNLGNBQWMsQ0FBQTtBQUNoQyxPQUFPLE9BQU8sTUFBTSxnQkFBZ0IsQ0FBQTtBQUNwQyxPQUFPLE1BQU0sTUFBTSxlQUFlLENBQUE7QUFDbEMsT0FBTyxPQUFPLE1BQU0sZ0JBQWdCLENBQUE7QUFDcEMsT0FBTyxTQUFTLE1BQU0sa0JBQWtCLENBQUE7QUFTeEMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUE7QUFDeEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ3BELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUNwRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUE7QUFDaEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ3BELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUNwRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQTtBQUN0RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sV0FBVyxDQUFBO0FBQ2xDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUE7QUFFcEM7SUFBQTtJQXdPQSxDQUFDO0lBbEtHLHNFQUFzRTtJQUN2RCxpQ0FBbUIsR0FBbEMsVUFBbUMsR0FBVyxFQUFFLEtBQWlCLEVBQUUsZ0JBQXFCO1FBQ3BGLE1BQU0sQ0FBQyxVQUFDLEtBQVUsRUFBRSxNQUFZLEVBQUUsT0FBMkI7WUFDekQsR0FBRyxDQUFDLENBQWEsVUFBSyxFQUFMLGVBQUssRUFBTCxtQkFBSyxFQUFMLElBQUs7Z0JBQWpCLElBQUksSUFBSSxjQUFBO2dCQUNULElBQU0s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RUFBRSxVQUFnQztRQUNoRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxXQUFXLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRSxNQUFNLENBQUM7Z0JBQ0gsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLE9BQU8sRUFBRSxnQ0FBOEIsR0FBSzthQUMvQyxDQUFBO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0lBQ0QsYUFBYSxFQUFFLFVBQUMsS0FBVSxFQUFFLEdBQVcsRUFBRSxVQUFnQztRQUNyRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksT0FBTyxVQUFVLENBQUMsYUFBYSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdEcsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUM7b0JBQ0gsUUFBUSxFQUFFLEdBQUc7b0JBQ2IsSUFBSSxFQUFFLGVBQWU7b0JBQ3JCLE9BQU8sRUFBRSxjQUFZLEdBQUcsNkJBQTBCO2lCQUNyRCxDQUFBO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUNELE1BQU0sRUFBRSxVQUFDLEtBQVUsRUFBRSxHQUFXLEVBQUUsU0FBK0IsRUFBRSxNQUFXLEVBQUUsT0FBMEIsRUFBRSxNQUFnQixFQUFFLElBQVk7UUFDdEksSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRXBELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDO2dCQUNILFFBQVEsRUFBRSxHQUFHO2dCQUNiLElBQUksRUFBRSxJQUFJO2dCQUNWLE9BQU8sRUFBRSxLQUFLO2FBQ2pCLENBQUE7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNmLENBQUM7Q0FDSixDQUFBIiwiZmlsZSI6InZhbGlkYXRvcnMvcm9vdC12YWxpZGF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGxdfQ==

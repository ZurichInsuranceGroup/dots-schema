"use strict";
var _ = require('lodash');
var composed_validation_result_1 = require('./composed-validation-result');
var root_validator_1 = require('./validators/root-validator');
var Schema = (function () {
    function Schema(schema, options) {
        if (options === void 0) { options = {}; }
        this.schema = schema;
        this.options = options;
        _.defaults(options, Schema.DefaultOptions);
    }
    Schema.prototype.cleanKey = function (key, object, options) {
        if (options === void 0) { options = {}; }
        var definition = this.schema[key];
        if (definition.type instanceof Function || definition.type instanceof Schema || _.isObject(definition.type)) {
            return root_validator_1.RootValidator.clean(definition, object[key], options, object);
        }
        else {
            throw new Error("Invalid type '" + definition.type + "' used in " + this.name);
        }
    };
    Schema.prototype.validate = function (object, key, options) {
        if (typeof key === 'string') {
            options = _.defaults({}, options, Schema.DefaultOptions);
            var validator = this.getValidator(key, object, options);
            if (options.clean) {
                var cleanOptions = _.defaults({}, options.clean, Schema.DefaultCleanOptions);
                object = this.clean(object, cleanOptions);
            }
            return validator(object, object, options);
        }
        else {
            options = _.defaults({}, key, Schema.DefaultOptions);
            var validator = this.getValidator(object, options);
            if (options.clean) {
                var cleanOptions = _.defaults({}, options.clean, Schema.DefaultCleanOptions);
                object = this.clean(object, cleanOptions);
            }
            return validator(object, object, options);
        }
    };
    Schema.prototype.clean = function (object, options) {
        if (options === void 0) { options = {}; }
        if (typeof object === 'undefined' || object === null) {
            return object;
        }
        _.defaults(options, Schema.DefaultCleanOptions);
        var result = options.mutate ? object : _.cloneDeep(object);
        for (var key in this.schema) {
            if (this.schema.hasOwnProperty(key)) {
                result[key] = this.cleanKey(key, object, options);
            }
        }
        return result;
    };
    Schema.prototype.extend = function (schema) {
        return this;
    };
    Schema.prototype._getValidators = function (object, options) {
        options = typeof options === 'object' ? _.defaults(options, this.options) : this.options;
        var validators = {};
        for (var key in this.schema) {
            if (this.schema.hasOwnProperty(key)) {
                var keyValidators = {};
                _.assign(keyValidators, root_validator_1.RootValidator.getValidatorsForKey(key, this.schema[key], options, object));
                validators[key] = keyValidators;
            }
        }
        return validators;
    };
    Schema.prototype._getValidatorsForKey = function (key, object, options) {
        options = typeof options === 'object' ? _.defaults(options, this.options) : this.options;
        return root_validator_1.RootValidator.getValidatorsForKey(key, this.schema[key], options, object);
    };
    Schema.prototype.getValidators = function (key, object, options) {
        if (typeof key === 'string') {
            return this._getValidatorsForKey(key, object, options);
        }
        else {
            return this._getValidators(key, object);
        }
    };
    Schema.prototype._getValidatorForKey = function (property, object, options) {
        var validators = this.getValidators(object, options);
        return function (value, object, options) {
            var result = new composed_validation_result_1.ComposedValidationResult();
            if (validators.hasOwnProperty(property)) {
                var propertyValidators = validators[property];
                for (var rule in propertyValidators) {
                    if (propertyValidators.hasOwnProperty(rule)) {
                        var validator = propertyValidators[rule];
                        var error = validator(value[property], object, options);
                        if (typeof error === 'string') {
                            result.and({
                                property: property,
                                rule: rule,
                                message: error
                            });
                        }
                        else if (typeof error === 'object') {
                            result.and(error);
                        }
                    }
                }
            }
            return result.isValid() ? null : result;
        };
    };
    Schema.prototype._getValidator = function (object, options) {
        var validators = this.getValidators(object, options);
        return function (value, object, options) {
            var result = new composed_validation_result_1.ComposedValidationResult();
            for (var property in validators) {
                if (validators.hasOwnProperty(property)) {
                    var propertyValidators = validators[property];
                    for (var rule in propertyValidators) {
                        if (propertyValidators.hasOwnProperty(rule)) {
                            var validator = propertyValidators[rule];
                            var error = validator(value[property], object, options);
                            if (typeof error === 'string') {
                                result.and({
                                    property: property,
                                    rule: rule,
                                    message: error
                                });
                            }
                            else if (typeof error === 'object') {
                                result.and(error);
                            }
                        }
                    }
                }
            }
            return result.isValid() ? null : result;
        };
    };
    Schema.prototype.getValidator = function (key, object, options) {
        if (typeof key === 'string') {
            return this._getValidatorForKey(key, object, options);
        }
        else {
            return this._getValidator(key, object);
        }
    };
    Schema.DefaultOptions = {
        name: 'Schema',
        clean: false,
        strict: false,
        context: {}
    };
    Schema.DefaultCleanOptions = {
        mutate: false,
        trimStrings: true,
        removeEmptyStrings: true,
        removeEmptyObjects: true,
        rounding: 'round',
        filter: false,
        autoConvert: true,
        getAutoValues: true
    };
    Schema.RegEx = {
        Email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    };
    return Schema;
}());
exports.Schema = Schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q2IsV0FBVyxFQUFFLElBQUk7UUFDakIsYUFBYSxFQUFFLElBQUk7S0FDdEIsQ0FBQTtJQUVNLFlBQUssR0FBRztRQUNYLEtBQUssRUFBRSxzSUFBc0k7S0FDaEosQ0FBQTtJQXVKTCxhQUFDO0FBQUQsQ0EvS0EsQUErS0MsSUFBQTtBQS9LWSxjQUFNLFNBK0tsQixDQUFBIiwiZmlsZSI6InNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJ1xuXG5pbXBvcnQge1xuICAgIFZhbGlkYXRpb25PcHRpb25zLFxuICAgIFZhbGlkYXRpb25SZXN1bHQsXG4gICAgVmFsaWRhdGlvbkRlZmluaXRpb24sXG4gICAgQ2xlYW5PcHRpb25zXG59IGZyb20gJy4vaW50ZXJmYWNlcydcbmltcG9ydCB7IENvbXBvc2VkVmFsaWRhdGlvblJlc3VsdH0gZnJvbSAnLi9jb21wb3NlZC12YWxpZGF0aW9uLXJlc3VsdCdcbmltcG9ydCB7IFJvb3RWYWxpZGF0b3IgfSBmcm9tICcuL3ZhbGlkYXRvcnMvcm9vdC12YWxpZGF0b3InXG5cbmV4cG9ydCBjbGFzcyBTY2hlbWEge1xuXG4gICAgcmVhZG9ubHkgbmFtZTogU3RyaW5nXG5cbiAgICBzdGF0aWMgRGVmYXVsdE9wdGlvbnM6IFZhbGlkYXRpb25PcHRpb25zID0ge1xuICAgICAgICBuYW1lOiAnU2NoZW1hJyxcbiAgICAgICAgY2xlYW46IGZhbHNlLFxuICAgICAgICBzdHJpY3Q6IGZhbHNlLFxuICAgICAgICBjb250ZXh0OiB7fVxuICAgIH1cblxuICAgIHN0YXRpYyBEZWZhdWx0Q2xlYW5PcHRpb25zOiBDbGVhbk9wdGlvbnMgPSB7XG4gICAgICAgIG11dGF0ZTogZmFsc2UsXG4gICAgICAgIHRyaW1TdHJpbmdzOiB0cnVlLFxuICAgICAgICByZW1vdmVFbXB0eVN0cmluZ3M6IHRydWUsXG4gICAgICAgIHJlbW92ZUVtcHR5T2JqZWN0czogdHJ1ZSxcbiAgICAgICAgcm91bmRpbmc6ICdyb3VuZCcsXG4gICAgICAgIGZpbHRlcjogZmFsc2UsXG4gICAgICAgIGF1dG9Db252ZXJ0OiB0cnVlLFxuICAgICAgICBnZXRBdXRvVmFsdWVzOiB0cnVlXG4gICAgfVxuXG4gICAgc3RhdGljIFJlZ0V4ID0ge1xuICAgICAgICBFbWFpbDogL15bYS16QS1aMC05LiEjJCUmJyorLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjaGVtYTogYW55LCBwcml2YXRlIG9wdGlvbnM6IFZhbGlkYXRpb25PcHRpb25zID0ge30pIHtcbiAgICAgICAgXy5kZWZhdWx0cyhvcHRpb25zLCBTY2hlbWEuRGVmYXVsdE9wdGlvbnMpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhbktleShrZXk6IHN0cmluZywgb2JqZWN0OiBhbnksIG9wdGlvbnM6IENsZWFuT3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGRlZmluaXRpb246IFZhbGlkYXRpb25EZWZpbml0aW9uID0gdGhpcy5zY2hlbWFba2V5XSBhcyBWYWxpZGF0aW9uRGVmaW5pdGlvblxuXG4gICAgICAgIGlmIChkZWZpbml0aW9uLnR5cGUgaW5zdGFuY2VvZiBGdW5jdGlvbiB8fCBkZWZpbml0aW9uLnR5cGUgaW5zdGFuY2VvZiBTY2hlbWEgfHwgXy5pc09iamVjdChkZWZpbml0aW9uLnR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gUm9vdFZhbGlkYXRvci5jbGVhbihkZWZpbml0aW9uLCBvYmplY3Rba2V5XSwgb3B0aW9ucywgb2JqZWN0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHR5cGUgJyR7ZGVmaW5pdGlvbi50eXBlfScgdXNlZCBpbiAke3RoaXMubmFtZX1gKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHZhbGlkYXRlKG9iamVjdDogYW55LCBrZXk/OiBzdHJpbmcgfCBWYWxpZGF0aW9uT3B0aW9ucywgb3B0aW9ucz86IFZhbGlkYXRpb25PcHRpb25zKTogVmFsaWRhdGlvblJlc3VsdCB8IG51bGwge1xuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKHt9LCBvcHRpb25zLCBTY2hlbWEuRGVmYXVsdE9wdGlvbnMpXG5cbiAgICAgICAgICAgIGNvbnN0IHZhbGlkYXRvciA9IHRoaXMuZ2V0VmFsaWRhdG9yKGtleSwgb2JqZWN0LCBvcHRpb25zKVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2xlYW4pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGVhbk9wdGlvbnMgPSBfLmRlZmF1bHRzKHt9LCBvcHRpb25zLmNsZWFuLCBTY2hlbWEuRGVmYXVsdENsZWFuT3B0aW9ucylcbiAgICAgICAgICAgICAgICBvYmplY3QgPSB0aGlzLmNsZWFuKG9iamVjdCwgY2xlYW5PcHRpb25zKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRvcihvYmplY3QsIG9iamVjdCwgb3B0aW9ucylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzKHt9LCBrZXksIFNjaGVtYS5EZWZhdWx0T3B0aW9ucylcblxuICAgICAgICAgICAgY29uc3QgdmFsaWRhdG9yID0gdGhpcy5nZXRWYWxpZGF0b3Iob2JqZWN0LCBvcHRpb25zKVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2xlYW4pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGVhbk9wdGlvbnMgPSBfLmRlZmF1bHRzKHt9LCBvcHRpb25zLmNsZWFuLCBTY2hlbWEuRGVmYXVsdENsZWFuT3B0aW9ucylcbiAgICAgICAgICAgICAgICBvYmplY3QgPSB0aGlzLmNsZWFuKG9iamVjdCwgY2xlYW5PcHRpb25zKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRvcihvYmplY3QsIG9iamVjdCwgb3B0aW9ucylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhbihvYmplY3Q6IGFueSwgb3B0aW9uczogQ2xlYW5PcHRpb25zID0ge30pOiBhbnkge1xuICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ3VuZGVmaW5lZCcgfHwgb2JqZWN0ID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0XG4gICAgICAgIH1cbiAgICAgICAgXy5kZWZhdWx0cyhvcHRpb25zLCBTY2hlbWEuRGVmYXVsdENsZWFuT3B0aW9ucylcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gb3B0aW9ucy5tdXRhdGUgPyBvYmplY3QgOiBfLmNsb25lRGVlcChvYmplY3QpXG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuc2NoZW1hKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY2hlbWEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5jbGVhbktleShrZXksIG9iamVjdCwgb3B0aW9ucylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICBwdWJsaWMgZXh0ZW5kKHNjaGVtYTogU2NoZW1hKTogU2NoZW1hIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRWYWxpZGF0b3JzKG9iamVjdDogYW55LCBvcHRpb25zPzogVmFsaWRhdGlvbk9wdGlvbnMpOiBhbnkge1xuICAgICAgICBvcHRpb25zID0gdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnID8gXy5kZWZhdWx0cyhvcHRpb25zLCB0aGlzLm9wdGlvbnMpIDogdGhpcy5vcHRpb25zXG4gICAgICAgIGNvbnN0IHZhbGlkYXRvcnM6IGFueSA9IHt9XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnNjaGVtYSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2NoZW1hLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlWYWxpZGF0b3JzID0ge31cbiAgICAgICAgICAgICAgICBfLmFzc2lnbihrZXlWYWxpZGF0b3JzLCBSb290VmFsaWRhdG9yLmdldFZhbGlkYXRvcnNGb3JLZXkoa2V5LCB0aGlzLnNjaGVtYVtrZXldLCBvcHRpb25zLCBvYmplY3QpKVxuICAgICAgICAgICAgICAgIHZhbGlkYXRvcnNba2V5XSA9IGtleVZhbGlkYXRvcnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsaWRhdG9yc1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldFZhbGlkYXRvcnNGb3JLZXkoa2V5OiBhbnksIG9iamVjdD86IGFueSwgb3B0aW9ucz86IFZhbGlkYXRpb25PcHRpb25zKTogYW55IHtcbiAgICAgICAgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyA/IF8uZGVmYXVsdHMob3B0aW9ucywgdGhpcy5vcHRpb25zKSA6IHRoaXMub3B0aW9uc1xuICAgICAgICByZXR1cm4gUm9vdFZhbGlkYXRvci5nZXRWYWxpZGF0b3JzRm9yS2V5KGtleSwgdGhpcy5zY2hlbWFba2V5XSwgb3B0aW9ucywgb2JqZWN0KVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRWYWxpZGF0b3JzKGtleT86IGFueSwgb2JqZWN0PzogYW55LCBvcHRpb25zPzogVmFsaWRhdGlvbk9wdGlvbnMpOiBhbnkge1xuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRWYWxpZGF0b3JzRm9yS2V5KGtleSwgb2JqZWN0LCBvcHRpb25zKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldFZhbGlkYXRvcnMoa2V5LCBvYmplY3QpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRWYWxpZGF0b3JGb3JLZXkocHJvcGVydHk6IHN0cmluZywgb2JqZWN0PzogYW55LCBvcHRpb25zPzogVmFsaWRhdGlvbk9wdGlvbnMpOiBhbnkge1xuICAgICAgICBjb25zdCB2YWxpZGF0b3JzID0gdGhpcy5nZXRWYWxpZGF0b3JzKG9iamVjdCwgb3B0aW9ucylcblxuICAgICAgICByZXR1cm4gKHZhbHVlOiBhbnksIG9iamVjdD86IGFueSwgb3B0aW9ucz86IFZhbGlkYXRpb25PcHRpb25zKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgQ29tcG9zZWRWYWxpZGF0aW9uUmVzdWx0KClcbiAgICAgICAgICAgIGlmICh2YWxpZGF0b3JzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnNbcHJvcGVydHldXG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBydWxlIGluIHByb3BlcnR5VmFsaWRhdG9ycykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlWYWxpZGF0b3JzLmhhc093blByb3BlcnR5KHJ1bGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWxpZGF0b3IgPSBwcm9wZXJ0eVZhbGlkYXRvcnNbcnVsZV1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gdmFsaWRhdG9yKHZhbHVlW3Byb3BlcnR5XSwgb2JqZWN0LCBvcHRpb25zKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVycm9yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hbmQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGU6IHJ1bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVycm9yID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5hbmQoZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LmlzVmFsaWQoKSA/IG51bGwgOiByZXN1bHRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX2dldFZhbGlkYXRvcihvYmplY3Q/OiBhbnksIG9wdGlvbnM/OiBWYWxpZGF0aW9uT3B0aW9ucyk6IGFueSB7XG4gICAgICAgIGNvbnN0IHZhbGlkYXRvcnMgPSB0aGlzLmdldFZhbGlkYXRvcnMob2JqZWN0LCBvcHRpb25zKVxuXG4gICAgICAgIHJldHVybiAodmFsdWU6IGFueSwgb2JqZWN0PzogYW55LCBvcHRpb25zPzogVmFsaWRhdGlvbk9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBDb21wb3NlZFZhbGlkYXRpb25SZXN1bHQoKVxuICAgICAgICAgICAgZm9yIChsZXQgcHJvcGVydHkgaW4gdmFsaWRhdG9ycykge1xuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eVZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzW3Byb3BlcnR5XVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHJ1bGUgaW4gcHJvcGVydHlWYWxpZGF0b3JzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlWYWxpZGF0b3JzLmhhc093blByb3BlcnR5KHJ1bGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRhdG9yID0gcHJvcGVydHlWYWxpZGF0b3JzW3J1bGVdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSB2YWxpZGF0b3IodmFsdWVbcHJvcGVydHldLCBvYmplY3QsIG9wdGlvbnMpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVycm9yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuYW5kKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGU6IHJ1bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVycm9yID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuYW5kKGVycm9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuaXNWYWxpZCgpID8gbnVsbCA6IHJlc3VsdFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldFZhbGlkYXRvcihrZXk/OiBhbnksIG9iamVjdD86IGFueSwgb3B0aW9ucz86IFZhbGlkYXRpb25PcHRpb25zKTogYW55IHtcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0VmFsaWRhdG9yRm9yS2V5KGtleSwgb2JqZWN0LCBvcHRpb25zKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldFZhbGlkYXRvcihrZXksIG9iamVjdClcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==

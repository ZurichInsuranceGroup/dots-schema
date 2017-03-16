import defaults from 'lodash.defaults';
import cloneDeep from 'lodash.clonedeep';
import assign from 'lodash.assign';
import isObject from 'lodash.isobject';
import { ComposedValidationResult } from './composed-validation-result';
import { RootValidator } from './validators/root-validator';
var Schema = (function () {
    function Schema(schema, options) {
        if (options === void 0) { options = {}; }
        this.schema = schema;
        this.options = options;
        defaults(options, Schema.DefaultOptions);
    }
    Schema.prototype.cleanKey = function (key, object, options) {
        if (options === void 0) { options = {}; }
        var definition = this.schema[key];
        if (definition.type instanceof Function || definition.type instanceof Schema || isObject(definition.type)) {
            return RootValidator.clean(definition, object[key], options, object);
        }
        else {
            throw new Error("Invalid type '" + definition.type + "' used in " + this.name);
        }
    };
    Schema.prototype.validate = function (object, key, options) {
        if (typeof key === 'string') {
            options = defaults({}, options, Schema.DefaultOptions);
            var validator = this.getValidator(key, object, options);
            if (options && options.autoClean) {
                object = this.clean(object, options);
            }
            return validator(object, object, options);
        }
        else {
            options = defaults({}, key, Schema.DefaultOptions);
            var validator = this.getValidator(object, options);
            if (options && options.autoClean) {
                object = this.clean(object, options);
            }
            return validator(object, object, options);
        }
    };
    Schema.prototype.clean = function (object, options) {
        if (options === void 0) { options = {}; }
        if (typeof object === 'undefined' || object === null) {
            return object;
        }
        defaults(options, Schema.DefaultOptions);
        var result = options.mutate ? object : cloneDeep(object);
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
        options = typeof options === 'object' ? defaults(options, this.options) : this.options;
        var validators = {};
        for (var key in this.schema) {
            if (this.schema.hasOwnProperty(key)) {
                var keyValidators = {};
                assign(keyValidators, RootValidator.getValidatorsForKey(key, this.schema[key], options, object));
                validators[key] = keyValidators;
            }
        }
        return validators;
    };
    Schema.prototype._getValidatorsForKey = function (key, object, options) {
        options = typeof options === 'object' ? defaults(options, this.options) : this.options;
        return RootValidator.getValidatorsForKey(key, this.schema[key], options, object);
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
            var result = new ComposedValidationResult();
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
            var result = new ComposedValidationResult();
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
    return Schema;
}());
export { Schema };
Schema.DefaultOptions = {
    name: 'Schema',
    autoClean: false,
    allowExtras: false,
    context: {},
    mutate: false,
    trimStrings: true,
    removeEmptyStrings: true,
    removeEmptyObjects: true,
    rounding: 'round',
    removeExtras: false,
    castTypes: true
};
Schema.RegEx = {
    Email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kb3RzLXNjaGVtYS9zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxRQUFRLE1BQU0saUJBQWlCLENBQUE7QUFDdEMsT0FBTyxTQUFTLE1BQU0sa0JBQWtCLENBQUE7QUFDeEMsT0FBTyxNQUFNLE1BQU0sZUFBZSxDQUFBO0FBQ2xDLE9BQU8sUUFBUSxNQUFNLGlCQUFpQixDQUFBO0FBT3RDLE9BQU8sRUFBRSx3QkFBd0IsRUFBQyxNQUFNLDhCQUE4QixDQUFBO0FBQ3RFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQTtBQUUzRDtJQXNCSSxnQkFBc0IsTUFBVyxFQUFVLE9BQStCO1FBQS9CLHdCQUFBLEVBQUEsWUFBK0I7UUFBcEQsV0FBTSxHQUFOLE1BQU0sQ0FBSztRQUFVLFlBQU8sR0FBUCxPQUFPLENBQXdCO1FBQ3RFLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQzVDLENBQUM7SUFFTyx5QkFBUSxHQUFoQixVQUFpQixHQUFXLEVBQUUsTUFBVyxFQUFFLE9BQStCO1FBQS9CLHdCQUFBLEVBQUEsWUFBK0I7UUFDdEUsSUFBTSxVQUFVLEdBQXlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUF5QixDQUFBO1FBRWpGLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFlBQVksUUFBUSxJQUFJLFVBQVUsQ0FBQyxJQUFJLFlBQVksTUFBTSxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hHLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQ3hFLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQWlCLFVBQVUsQ0FBQyxJQUFJLGtC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

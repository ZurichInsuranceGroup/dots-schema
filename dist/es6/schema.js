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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kb3RzLXNjaGVtYS9zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxRQUFRLE1BQU0saUJBQWlCLENBQUE7QUFDdEMsT0FBTyxTQUFTLE1BQU0sa0JBQWtCLENBQUE7QUFDeEMsT0FBTyxNQUFNLE1BQU0sZUFBZSxDQUFBO0FBQ2xDLE9BQU8sUUFBUSxNQUFNLGlCQUFpQixDQUFBO0FBT3RDLE9BQU8sRUFBRSx3QkFBd0IsRUFBQyxNQUFNLDhCQUE4QixDQUFBO0FBQ3RFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQTtBQUUzRDtJQXNCSSxnQkFBc0IsTUFBVyxFQUFVLE9BQStCO1FBQS9CLHdCQUFBLEVBQUEsWUFBK0I7UUFBcEQsV0FBTSxHQUFOLE1BQU0sQ0FBSztRQUFVLFlBQU8sR0FBUCxPQUFPLENBQXdCO1FBQ3RFLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQzVDLENBQUM7SUFFTyx5QkFBUSxHQUFoQixVQUFpQixHQUFXLEVBQUUsTUFBVyxFQUFFLE9BQStCO1FBQS9CLHdCQUFBLEVBQUEsWUFBK0I7UUFDdEUsSUFBTSxVQUFVLEdBQXlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUF5QixDQUFBO1FBRWpGLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFlBQVksUUFBUSxJQUFJLFVBQVUsQ0FBQyxJQUFJLFlBQVksTUFBTSxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hHLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQ3hFLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQWlCLFVBQVUsQ0FBQyxJQUFJLGtCQUFhLElBQUksQ0FBQyxJQUFNLENBQUMsQ0FBQTtRQUM3RSxDQUFDO0lBQ0wsQ0FBQztJQUVNLHlCQUFRLEdBQWYsVUFBZ0IsTUFBVyxFQUFFLEdBQWdDLEVBQUUsT0FBMkI7UUFDdEYsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMxQixPQUFPLEdBQUcsUUFBUSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1lBRXRELElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUN6RCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUN4QyxDQUFDO1lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQzdDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE9BQU8sR0FBRyxRQUFRLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUE7WUFFbEQsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFDcEQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFDeEMsQ0FBQztZQUNELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUM3QyxDQUFDO0lBQ0wsQ0FBQztJQUVNLHNCQUFLLEdBQVosVUFBYSxNQUFXLEVBQUUsT0FBK0I7UUFBL0Isd0JBQUEsRUFBQSxZQUErQjtRQUNyRCxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbkQsTUFBTSxDQUFDLE1BQU0sQ0FBQTtRQUNqQixDQUFDO1FBQ0QsUUFBUSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDeEMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRTFELEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUNyRCxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUE7SUFDakIsQ0FBQztJQUVNLHVCQUFNLEdBQWIsVUFBYyxNQUFjO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRU8sK0JBQWMsR0FBdEIsVUFBdUIsTUFBVyxFQUFFLE9BQTJCO1FBQzNELE9BQU8sR0FBRyxPQUFPLE9BQU8sS0FBSyxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQTtRQUN0RixJQUFNLFVBQVUsR0FBUSxFQUFFLENBQUE7UUFDMUIsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxJQUFNLGFBQWEsR0FBRyxFQUFFLENBQUE7Z0JBQ3hCLE1BQU0sQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFBO2dCQUNoRyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFBO1lBQ25DLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQTtJQUNyQixDQUFDO0lBRU8scUNBQW9CLEdBQTVCLFVBQTZCLEdBQVEsRUFBRSxNQUFZLEVBQUUsT0FBMkI7UUFDNUUsT0FBTyxHQUFHLE9BQU8sT0FBTyxLQUFLLFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFBO1FBQ3RGLE1BQU0sQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQ3BGLENBQUM7SUFFTSw4QkFBYSxHQUFwQixVQUFxQixHQUFTLEVBQUUsTUFBWSxFQUFFLE9BQTJCO1FBQ3JFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQzFELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUMzQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLG9DQUFtQixHQUEzQixVQUE0QixRQUFnQixFQUFFLE1BQVksRUFBRSxPQUEyQjtRQUNuRixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUV0RCxNQUFNLENBQUMsVUFBQyxLQUFVLEVBQUUsTUFBWSxFQUFFLE9BQTJCO1lBQ3pELElBQU0sTUFBTSxHQUFHLElBQUksd0JBQXdCLEVBQUUsQ0FBQTtZQUM3QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsSUFBTSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7Z0JBRS9DLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLGtCQUFrQixDQUFDLENBQUMsQ0FBQztvQkFDbEMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUMsSUFBTSxTQUFTLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUE7d0JBQzFDLElBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO3dCQUV6RCxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDOzRCQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDO2dDQUNQLFFBQVEsRUFBRSxRQUFRO2dDQUNsQixJQUFJLEVBQUUsSUFBSTtnQ0FDVixPQUFPLEVBQUUsS0FBSzs2QkFDakIsQ0FBQyxDQUFBO3dCQUNOLENBQUM7d0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7NEJBQ25DLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7d0JBQ3JCLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQTtRQUMzQyxDQUFDLENBQUE7SUFDTCxDQUFDO0lBRU8sOEJBQWEsR0FBckIsVUFBc0IsTUFBWSxFQUFFLE9BQTJCO1FBQzNELElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBRXRELE1BQU0sQ0FBQyxVQUFDLEtBQVUsRUFBRSxNQUFZLEVBQUUsT0FBMkI7WUFDekQsSUFBTSxNQUFNLEdBQUcsSUFBSSx3QkFBd0IsRUFBRSxDQUFBO1lBQzdDLEdBQUcsQ0FBQyxDQUFDLElBQUksUUFBUSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxJQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtvQkFFL0MsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksa0JBQWtCLENBQUMsQ0FBQyxDQUFDO3dCQUNsQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMxQyxJQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTs0QkFDMUMsSUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7NEJBRXpELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0NBQzVCLE1BQU0sQ0FBQyxHQUFHLENBQUM7b0NBQ1AsUUFBUSxFQUFFLFFBQVE7b0NBQ2xCLElBQUksRUFBRSxJQUFJO29DQUNWLE9BQU8sRUFBRSxLQUFLO2lDQUNqQixDQUFDLENBQUE7NEJBQ04sQ0FBQzs0QkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQ0FDbkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTs0QkFDckIsQ0FBQzt3QkFDTCxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUE7UUFDM0MsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUVNLDZCQUFZLEdBQW5CLFVBQW9CLEdBQVMsRUFBRSxNQUFZLEVBQUUsT0FBMkI7UUFDcEUsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDekQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQzFDLENBQUM7SUFDTCxDQUFDO0lBQ0wsYUFBQztBQUFELENBektBLEFBeUtDOztBQXJLVSxxQkFBYyxHQUFzQjtJQUN2QyxJQUFJLEVBQUUsUUFBUTtJQUNkLFNBQVMsRUFBRSxLQUFLO0lBQ2hCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLE9BQU8sRUFBRSxFQUFFO0lBQ1gsTUFBTSxFQUFFLEtBQUs7SUFDYixXQUFXLEVBQUUsSUFBSTtJQUNqQixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLGtCQUFrQixFQUFFLElBQUk7SUFDeEIsUUFBUSxFQUFFLE9BQU87SUFDakIsWUFBWSxFQUFFLEtBQUs7SUFDbkIsU0FBUyxFQUFFLElBQUk7Q0FDbEIsQ0FBQTtBQUVNLFlBQUssR0FBRztJQUNYLEtBQUssRUFBRSxzSUFBc0k7Q0FDaEosQ0FBQSIsImZpbGUiOiJzY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnbG9kYXNoLmRlZmF1bHRzJ1xuaW1wb3J0IGNsb25lRGVlcCBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJ1xuaW1wb3J0IGFzc2lnbiBmcm9tICdsb2Rhc2guYXNzaWduJ1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJ2xvZGFzaC5pc29iamVjdCdcblxuaW1wb3J0IHtcbiAgICBWYWxpZGF0aW9uT3B0aW9ucyxcbiAgICBWYWxpZGF0aW9uUmVzdWx0LFxuICAgIFZhbGlkYXRpb25EZWZpbml0aW9uXG59IGZyb20gJy4vaW50ZXJmYWNlcydcbmltcG9ydCB7IENvbXBvc2VkVmFsaWRhdGlvblJlc3VsdH0gZnJvbSAnLi9jb21wb3NlZC12YWxpZGF0aW9uLXJlc3VsdCdcbmltcG9ydCB7IFJvb3RWYWxpZGF0b3IgfSBmcm9tICcuL3ZhbGlkYXRvcnMvcm9vdC12YWxpZGF0b3InXG5cbmV4cG9ydCBjbGFzcyBTY2hlbWEge1xuXG4gICAgcmVhZG9ubHkgbmFtZTogU3RyaW5nXG5cbiAgICBzdGF0aWMgRGVmYXVsdE9wdGlvbnM6IFZhbGlkYXRpb25PcHRpb25zID0ge1xuICAgICAgICBuYW1lOiAnU2NoZW1hJyxcbiAgICAgICAgYXV0b0NsZWFuOiBmYWxzZSxcbiAgICAgICAgYWxsb3dFeHRyYXM6IGZhbHNlLFxuICAgICAgICBjb250ZXh0OiB7fSxcbiAgICAgICAgbXV0YXRlOiBmYWxzZSxcbiAgICAgICAgdHJpbVN0cmluZ3M6IHRydWUsXG4gICAgICAgIHJlbW92ZUVtcHR5U3RyaW5nczogdHJ1ZSxcbiAgICAgICAgcmVtb3ZlRW1wdHlPYmplY3RzOiB0cnVlLFxuICAgICAgICByb3VuZGluZzogJ3JvdW5kJyxcbiAgICAgICAgcmVtb3ZlRXh0cmFzOiBmYWxzZSxcbiAgICAgICAgY2FzdFR5cGVzOiB0cnVlXG4gICAgfVxuXG4gICAgc3RhdGljIFJlZ0V4ID0ge1xuICAgICAgICBFbWFpbDogL15bYS16QS1aMC05LiEjJCUmJyorLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjaGVtYTogYW55LCBwcml2YXRlIG9wdGlvbnM6IFZhbGlkYXRpb25PcHRpb25zID0ge30pIHtcbiAgICAgICAgZGVmYXVsdHMob3B0aW9ucywgU2NoZW1hLkRlZmF1bHRPcHRpb25zKVxuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYW5LZXkoa2V5OiBzdHJpbmcsIG9iamVjdDogYW55LCBvcHRpb25zOiBWYWxpZGF0aW9uT3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGRlZmluaXRpb246IFZhbGlkYXRpb25EZWZpbml0aW9uID0gdGhpcy5zY2hlbWFba2V5XSBhcyBWYWxpZGF0aW9uRGVmaW5pdGlvblxuXG4gICAgICAgIGlmIChkZWZpbml0aW9uLnR5cGUgaW5zdGFuY2VvZiBGdW5jdGlvbiB8fCBkZWZpbml0aW9uLnR5cGUgaW5zdGFuY2VvZiBTY2hlbWEgfHwgaXNPYmplY3QoZGVmaW5pdGlvbi50eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFJvb3RWYWxpZGF0b3IuY2xlYW4oZGVmaW5pdGlvbiwgb2JqZWN0W2tleV0sIG9wdGlvbnMsIG9iamVjdClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0eXBlICcke2RlZmluaXRpb24udHlwZX0nIHVzZWQgaW4gJHt0aGlzLm5hbWV9YClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB2YWxpZGF0ZShvYmplY3Q6IGFueSwga2V5Pzogc3RyaW5nIHwgVmFsaWRhdGlvbk9wdGlvbnMsIG9wdGlvbnM/OiBWYWxpZGF0aW9uT3B0aW9ucyk6IFZhbGlkYXRpb25SZXN1bHQgfCBudWxsIHtcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gZGVmYXVsdHMoe30sIG9wdGlvbnMsIFNjaGVtYS5EZWZhdWx0T3B0aW9ucylcblxuICAgICAgICAgICAgY29uc3QgdmFsaWRhdG9yID0gdGhpcy5nZXRWYWxpZGF0b3Ioa2V5LCBvYmplY3QsIG9wdGlvbnMpXG4gICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmF1dG9DbGVhbikge1xuICAgICAgICAgICAgICAgIG9iamVjdCA9IHRoaXMuY2xlYW4ob2JqZWN0LCBvcHRpb25zKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRvcihvYmplY3QsIG9iamVjdCwgb3B0aW9ucylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBkZWZhdWx0cyh7fSwga2V5LCBTY2hlbWEuRGVmYXVsdE9wdGlvbnMpXG5cbiAgICAgICAgICAgIGNvbnN0IHZhbGlkYXRvciA9IHRoaXMuZ2V0VmFsaWRhdG9yKG9iamVjdCwgb3B0aW9ucylcbiAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuYXV0b0NsZWFuKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0ID0gdGhpcy5jbGVhbihvYmplY3QsIG9wdGlvbnMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdG9yKG9iamVjdCwgb2JqZWN0LCBvcHRpb25zKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFuKG9iamVjdDogYW55LCBvcHRpb25zOiBWYWxpZGF0aW9uT3B0aW9ucyA9IHt9KTogYW55IHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICd1bmRlZmluZWQnIHx8IG9iamVjdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG9iamVjdFxuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHRzKG9wdGlvbnMsIFNjaGVtYS5EZWZhdWx0T3B0aW9ucylcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gb3B0aW9ucy5tdXRhdGUgPyBvYmplY3QgOiBjbG9uZURlZXAob2JqZWN0KVxuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnNjaGVtYSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2NoZW1hLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMuY2xlYW5LZXkoa2V5LCBvYmplY3QsIG9wdGlvbnMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgcHVibGljIGV4dGVuZChzY2hlbWE6IFNjaGVtYSk6IFNjaGVtYSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0VmFsaWRhdG9ycyhvYmplY3Q6IGFueSwgb3B0aW9ucz86IFZhbGlkYXRpb25PcHRpb25zKTogYW55IHtcbiAgICAgICAgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyA/IGRlZmF1bHRzKG9wdGlvbnMsIHRoaXMub3B0aW9ucykgOiB0aGlzLm9wdGlvbnNcbiAgICAgICAgY29uc3QgdmFsaWRhdG9yczogYW55ID0ge31cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuc2NoZW1hKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY2hlbWEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleVZhbGlkYXRvcnMgPSB7fVxuICAgICAgICAgICAgICAgIGFzc2lnbihrZXlWYWxpZGF0b3JzLCBSb290VmFsaWRhdG9yLmdldFZhbGlkYXRvcnNGb3JLZXkoa2V5LCB0aGlzLnNjaGVtYVtrZXldLCBvcHRpb25zLCBvYmplY3QpKVxuICAgICAgICAgICAgICAgIHZhbGlkYXRvcnNba2V5XSA9IGtleVZhbGlkYXRvcnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsaWRhdG9yc1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldFZhbGlkYXRvcnNGb3JLZXkoa2V5OiBhbnksIG9iamVjdD86IGFueSwgb3B0aW9ucz86IFZhbGlkYXRpb25PcHRpb25zKTogYW55IHtcbiAgICAgICAgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyA/IGRlZmF1bHRzKG9wdGlvbnMsIHRoaXMub3B0aW9ucykgOiB0aGlzLm9wdGlvbnNcbiAgICAgICAgcmV0dXJuIFJvb3RWYWxpZGF0b3IuZ2V0VmFsaWRhdG9yc0ZvcktleShrZXksIHRoaXMuc2NoZW1hW2tleV0sIG9wdGlvbnMsIG9iamVjdClcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VmFsaWRhdG9ycyhrZXk/OiBhbnksIG9iamVjdD86IGFueSwgb3B0aW9ucz86IFZhbGlkYXRpb25PcHRpb25zKTogYW55IHtcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0VmFsaWRhdG9yc0ZvcktleShrZXksIG9iamVjdCwgb3B0aW9ucylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRWYWxpZGF0b3JzKGtleSwgb2JqZWN0KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0VmFsaWRhdG9yRm9yS2V5KHByb3BlcnR5OiBzdHJpbmcsIG9iamVjdD86IGFueSwgb3B0aW9ucz86IFZhbGlkYXRpb25PcHRpb25zKTogYW55IHtcbiAgICAgICAgY29uc3QgdmFsaWRhdG9ycyA9IHRoaXMuZ2V0VmFsaWRhdG9ycyhvYmplY3QsIG9wdGlvbnMpXG5cbiAgICAgICAgcmV0dXJuICh2YWx1ZTogYW55LCBvYmplY3Q/OiBhbnksIG9wdGlvbnM/OiBWYWxpZGF0aW9uT3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IENvbXBvc2VkVmFsaWRhdGlvblJlc3VsdCgpXG4gICAgICAgICAgICBpZiAodmFsaWRhdG9ycy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eVZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzW3Byb3BlcnR5XVxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcnVsZSBpbiBwcm9wZXJ0eVZhbGlkYXRvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5VmFsaWRhdG9ycy5oYXNPd25Qcm9wZXJ0eShydWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRhdG9yID0gcHJvcGVydHlWYWxpZGF0b3JzW3J1bGVdXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IHZhbGlkYXRvcih2YWx1ZVtwcm9wZXJ0eV0sIG9iamVjdCwgb3B0aW9ucylcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuYW5kKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3BlcnR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWxlOiBydWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuYW5kKGVycm9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5pc1ZhbGlkKCkgPyBudWxsIDogcmVzdWx0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRWYWxpZGF0b3Iob2JqZWN0PzogYW55LCBvcHRpb25zPzogVmFsaWRhdGlvbk9wdGlvbnMpOiBhbnkge1xuICAgICAgICBjb25zdCB2YWxpZGF0b3JzID0gdGhpcy5nZXRWYWxpZGF0b3JzKG9iamVjdCwgb3B0aW9ucylcblxuICAgICAgICByZXR1cm4gKHZhbHVlOiBhbnksIG9iamVjdD86IGFueSwgb3B0aW9ucz86IFZhbGlkYXRpb25PcHRpb25zKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgQ29tcG9zZWRWYWxpZGF0aW9uUmVzdWx0KClcbiAgICAgICAgICAgIGZvciAobGV0IHByb3BlcnR5IGluIHZhbGlkYXRvcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsaWRhdG9ycy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydHlWYWxpZGF0b3JzID0gdmFsaWRhdG9yc1twcm9wZXJ0eV1cblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBydWxlIGluIHByb3BlcnR5VmFsaWRhdG9ycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5VmFsaWRhdG9ycy5oYXNPd25Qcm9wZXJ0eShydWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkYXRvciA9IHByb3BlcnR5VmFsaWRhdG9yc1tydWxlXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gdmFsaWRhdG9yKHZhbHVlW3Byb3BlcnR5XSwgb2JqZWN0LCBvcHRpb25zKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFuZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWxlOiBydWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmFuZChlcnJvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LmlzVmFsaWQoKSA/IG51bGwgOiByZXN1bHRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRWYWxpZGF0b3Ioa2V5PzogYW55LCBvYmplY3Q/OiBhbnksIG9wdGlvbnM/OiBWYWxpZGF0aW9uT3B0aW9ucyk6IGFueSB7XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldFZhbGlkYXRvckZvcktleShrZXksIG9iamVjdCwgb3B0aW9ucylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRWYWxpZGF0b3Ioa2V5LCBvYmplY3QpXG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
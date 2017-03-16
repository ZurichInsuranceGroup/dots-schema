import assign from 'lodash.assign';
import partialRight from 'lodash.partialright';
import { RootValidator } from './validators/root-validator';
export function cleaned(validator, key, definition, options, defaultObject, custom, rule) {
    var defaultOptions = options;
    return function (value, object, options) {
        options = assign({}, defaultOptions, options);
        object = typeof object !== 'undefined' ? object : defaultObject;
        if (options && options.autoClean) {
            value = RootValidator.clean(definition, value, options, object);
        }
        return validator(value, key, definition, object, options, custom, rule);
    };
}
var connectSchema = function (schema, object, context) {
    var validators = schema.getValidators();
    var connected = {};
    for (var field in validators) {
        if (validators.hasOwnProperty(field)) {
            var fieldValidators = validators[field];
            var fieldConnected = {};
            for (var rule in fieldValidators) {
                if (fieldValidators.hasOwnProperty(rule)) {
                    fieldConnected[rule] = partialRight(fieldValidators[rule], object, {
                        context: context,
                        clean: true
                    });
                }
            }
            connected[field] = fieldConnected;
        }
    }
    return connected;
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kb3RzLXNjaGVtYS9jbGVhbmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBTSxNQUFNLGVBQWUsQ0FBQTtBQUNsQyxPQUFPLFlBQVksTUFBTSxxQkFBcUIsQ0FBQTtBQVU5QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUE7QUFHM0QsTUFBTSxrQkFBa0IsU0FBYyxFQUFFLEdBQVcsRUFBRSxVQUFnQyxFQUFFLE9BQTBCLEVBQUUsYUFBbUIsRUFBRSxNQUFpQixFQUFFLElBQWE7SUFDcEssSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFBO0lBRTlCLE1BQU0sQ0FBQyxVQUFDLEtBQVUsRUFBRSxNQUFZLEVBQUUsT0FBMkI7UUFDekQsT0FBTyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBRTdDLE1BQU0sR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLEdBQUcsTUFBTSxHQUFHLGFBQWEsQ0FBQTtRQUUvRCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDbkUsQ0FBQztRQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDM0UsQ0FBQyxDQUFBO0FBQ0wsQ0FBQztBQUVELElBQU0sYUFBYSxHQUFHLFVBQUMsTUFBYyxFQUFFLE1BQVcsRUFBRSxPQUFZO0lBQzVELElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUN6QyxJQUFNLFNBQVMsR0FBUSxFQUFFLENBQUE7SUFFekIsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMzQixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDekMsSUFBTSxjQUFjLEdBQVEsRUFBRSxDQUFBO1lBQzlCLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUU7d0JBQy9ELE9BQU8sRUFBRSxPQUFPO3dCQUNoQixLQUFLLEVBQUUsSUFBSTtxQkFDZCxDQUFDLENBQUE7Z0JBQ04sQ0FBQztZQUNMLENBQUM7WUFDRCxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsY0FBYyxDQUFBO1FBQ3JDLENBQUM7SUFDTCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQTtBQUNwQixDQUFDLENBQUEiLCJmaWxlIjoiY2xlYW5lZC5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbF19

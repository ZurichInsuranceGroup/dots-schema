import isObject from 'lodash.isobject';
import isArray from 'lodash.isarray';
import { ComposedValidationResult } from '../composed-validation-result';
import { Schema } from '../schema';
import { cleaned } from '../cleaned';
var SchemaValidator = (function () {
    function SchemaValidator() {
    }
    SchemaValidator.getValidatorsForKey = function (key, definition, options, object) {
        return {
            type: cleaned(SchemaValidator.RULES.type, key, definition, options),
            schema: cleaned(SchemaValidator.RULES.schema, key, definition, options)
        };
    };
    SchemaValidator.clean = function (definition, value, options, object) {
        var schema = definition.type;
        return schema.clean(value, options);
    };
    return SchemaValidator;
}());
export { SchemaValidator };
SchemaValidator.RULES = {
    type: function (value, key, definition) {
        if ((typeof value !== 'undefined' && value !== null) && (!(isObject(value) || isArray(value)))) {
            return {
                property: key,
                rule: 'type',
                message: "Property " + key + " must be an Object or an Array of Objects"
            };
        }
        return null;
    },
    schema: function (value, key, definition, options) {
        if (value instanceof Schema || typeof value === 'object') {
            var schema = definition.type;
            var result = new ComposedValidationResult();
            result.and(schema.validate(value, options), key);
            return result;
        }
        return null;
    }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9kb3RzLXNjaGVtYS92YWxpZGF0b3JzL3NjaGVtYS12YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxRQUFRLE1BQU0saUJBQWlCLENBQUE7QUFDdEMsT0FBTyxPQUFPLE1BQU0sZ0JBQWdCLENBQUE7QUFPcEMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUE7QUFDeEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUNsQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFBO0FBRXBDO0lBQUE7SUFvQ0EsQ0FBQztJQVppQixtQ0FBbUIsR0FBakMsVUFBa0MsR0FBVyxFQUFFLFVBQWdDLEVBQUUsT0FBMEIsRUFBRSxNQUFZO1FBQ3JILE1BQU0sQ0FBQztZQUNILElBQUksRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUM7WUFDbkUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQztTQUMxRSxDQUFBO0lBQ0wsQ0FBQztJQUVhLHFCQUFLLEdBQW5CLFVBQW9CLFVBQWdDLEVBQUUsS0FBVSxFQUFFLE9BQTBCLEVBQUUsTUFBVztRQUNyRyxJQUFNLE1BQU0sR0FBVyxVQUFVLENBQUMsSUFBYyxDQUFBO1FBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUN2QyxDQUFDO0lBRUwsc0JBQUM7QUFBRCxDQXBDQSxBQW9DQzs7QUFsQ2lCLHFCQUFLLEdBQUc7SUFDbEIsSUFBSSxFQUFFLFVBQUMsS0FBVSxFQUFFLEdBQVcsRUFBRSxVQUFnQztRQUM1RCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdGLE1BQU0sQ0FBQztnQkFDSCxRQUFRLEVBQUUsR0FBRztnQkFDYixJQUFJLEVBQUUsTUFBTTtnQkFDWixPQUFPLEVBQUUsY0FBWSxHQUFHLDhDQUEyQzthQUN0RSxDQUFBO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0lBQ0QsTUFBTSxFQUFFLFVBQUMsS0FBVSxFQUFFLEdBQVcsRUFBRSxVQUFnQyxFQUFFLE9BQTBCO1FBQzFGLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxNQUFNLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2RCxJQUFNLE1BQU0sR0FBVyxVQUFVLENBQUMsSUFBYyxDQUFBO1lBQ2hELElBQU0sTUFBTSxHQUFHLElBQUksd0JBQXdCLEVBQUUsQ0FBQTtZQUM3QyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUE7UUFDakIsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0NBQ0osQ0FBQSIsImZpbGUiOiJ2YWxpZGF0b3JzL3NjaGVtYS12YWxpZGF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGxdfQ==

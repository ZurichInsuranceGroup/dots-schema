import moment from 'moment';
import { cleaned } from '../cleaned';
import { min, max } from './common-rules';
var StringValidator = (function () {
    function StringValidator() {
    }
    StringValidator.getValidatorsForKey = function (key, definition, options, object) {
        var validators = {
            type: cleaned(StringValidator.RULES.type, key, definition, options)
        };
        if (typeof definition.min !== 'undefined') {
            validators.min = cleaned(StringValidator.RULES.min, key, definition, options);
        }
        if (typeof definition.max !== 'undefined') {
            validators.max = cleaned(StringValidator.RULES.max, key, definition, options);
        }
        if (definition.regEx) {
            validators.regEx = cleaned(StringValidator.RULES.regEx, key, definition, options);
        }
        return validators;
    };
    StringValidator.clean = function (definition, value, options, object) {
        if (options.castTypes && typeof value !== 'string') {
            if (typeof value === 'number' || typeof value === 'boolean') {
                return value.toString();
            }
            else if (value instanceof Date) {
                if (typeof definition.dateFormat === 'string') {
                    return moment(value).format(definition.dateFormat);
                }
                else {
                    return moment(value).format();
                }
            }
        }
        if (typeof value === 'string') {
            if (options.trimStrings || definition.trim) {
                if (definition.trim !== false) {
                    value = value.trim();
                }
            }
            if (value.trim().length === 0 && (definition.removeEmpty || options.removeEmptyStrings)) {
                if (definition.removeEmpty !== false) {
                    value = null;
                }
            }
        }
        return value;
    };
    return StringValidator;
}());
export { StringValidator };
StringValidator.RULES = {
    type: function (value, key, definition) {
        if ((typeof value !== 'undefined' && value !== null) && typeof value !== 'string') {
            return {
                property: key,
                rule: 'type',
                message: "Property " + key + " must be of type String"
            };
        }
        return null;
    },
    regEx: function (value, key, definition) {
        if (typeof value === 'string' && definition.regEx instanceof RegExp && !definition.regEx.test(value)) {
            return {
                property: key,
                rule: 'regEx',
                message: "Property " + key + " must match " + definition.regEx.toString()
            };
        }
        return null;
    },
    min: min,
    max: max
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9kb3RzLXNjaGVtYS92YWxpZGF0b3JzL3N0cmluZy12YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFBO0FBUzNCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUE7QUFDcEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUV6QztJQUFBO0lBOEVBLENBQUM7SUFuRGlCLG1DQUFtQixHQUFqQyxVQUFrQyxHQUFXLEVBQUUsVUFBZ0MsRUFBRSxPQUEwQixFQUFFLE1BQVk7UUFDckgsSUFBTSxVQUFVLEdBQVE7WUFDcEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQztTQUN0RSxDQUFBO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxVQUFVLENBQUMsR0FBRyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDeEMsVUFBVSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNqRixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxVQUFVLENBQUMsR0FBRyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDeEMsVUFBVSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNqRixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbkIsVUFBVSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNyRixDQUFDO1FBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQTtJQUNyQixDQUFDO0lBRWEscUJBQUssR0FBbkIsVUFBb0IsVUFBZ0MsRUFBRSxLQUFVLEVBQUUsT0FBMEIsRUFBRSxNQUFXO1FBRXJHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNqRCxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksT0FBTyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDMUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUMzQixDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxPQUFPLFVBQVUsQ0FBQyxVQUFVLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDNUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFBO2dCQUN0RCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7Z0JBQ2pDLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDNUIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDekMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUM1QixLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUN4QixDQUFDO1lBQ0wsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RGLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDbkMsS0FBSyxHQUFHLElBQUksQ0FBQTtnQkFDaEIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQTtJQUNoQixDQUFDO0lBRUwsc0JBQUM7QUFBRCxDQTlFQSxBQThFQzs7QUE1RWlCLHFCQUFLLEdBQUc7SUFDbEIsSUFBSSxFQUFFLFVBQUMsS0FBVSxFQUFFLEdBQVcsRUFBRSxVQUFnQztRQUM1RCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNoRixNQUFNLENBQUM7Z0JBQ0gsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsSUFBSSxFQUFFLE1BQU07Z0JBQ1osT0FBTyxFQUFFLGNBQVksR0FBRyw0QkFBeUI7YUFDcEQsQ0FBQTtRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUNELEtBQUssRUFBRSxVQUFDLEtBQVUsRUFBRSxHQUFXLEVBQUUsVUFBZ0M7UUFDN0QsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLFVBQVUsQ0FBQyxLQUFLLFlBQVksTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25HLE1BQU0sQ0FBQztnQkFDSCxRQUFRLEVBQUUsR0FBRztnQkFDYixJQUFJLEVBQUUsT0FBTztnQkFDYixPQUFPLEVBQUUsY0FBWSxHQUFHLG9CQUFlLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFJO2FBQ3ZFLENBQUE7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNmLENBQUM7SUFDRCxHQUFHLEtBQUE7SUFDSCxHQUFHLEtBQUE7Q0FDTixDQUFBIiwiZmlsZSI6InZhbGlkYXRvcnMvc3RyaW5nLXZhbGlkYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbF19

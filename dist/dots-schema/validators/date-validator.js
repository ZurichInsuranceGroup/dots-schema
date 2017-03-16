import moment from 'moment';
import { cleaned } from '../cleaned';
var DateValidator = (function () {
    function DateValidator() {
    }
    DateValidator.getValidatorsForKey = function (key, definition, options, object) {
        var validators = {
            type: cleaned(DateValidator.RULES.type, key, definition, options)
        };
        if (definition.before) {
            validators.before = cleaned(DateValidator.RULES.before, key, definition, options);
        }
        if (definition.after) {
            validators.after = cleaned(DateValidator.RULES.after, key, definition, options);
        }
        return validators;
    };
    DateValidator.clean = function (definition, value, options, object) {
        if (!options.castTypes) {
            return value;
        }
        if (typeof value === 'string') {
            if (typeof definition.dateFormat === 'string') {
                return moment(value, definition.dateFormat).toDate();
            }
            else {
                return moment(value).toDate();
            }
        }
        return value;
    };
    return DateValidator;
}());
export { DateValidator };
DateValidator.RULES = {
    type: function (value, key, definition) {
        if ((typeof value !== 'undefined' && value !== null) && !(value instanceof Date)) {
            return {
                property: key,
                rule: 'type',
                message: "Property " + key + " must be of type Date"
            };
        }
        return null;
    },
    before: function (value, key, definition) {
        if (value instanceof Date && (definition.before instanceof Date) && !moment(value).isBefore(definition.before)) {
            return {
                property: key,
                rule: 'type',
                message: "Property " + key + " must be a date before " + definition.before
            };
        }
        return null;
    },
    after: function (value, key, definition) {
        if (value instanceof Date && (definition.after instanceof Date) && !moment(value).isAfter(definition.after)) {
            return {
                property: key,
                rule: 'type',
                message: "Property " + key + " must be a date after " + definition.after
            };
        }
        return null;
    }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9kb3RzLXNjaGVtYS92YWxpZGF0b3JzL2RhdGUtdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQTtBQVEzQixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFBO0FBRXBDO0lBQUE7SUFnRUEsQ0FBQztJQTdCaUIsaUNBQW1CLEdBQWpDLFVBQWtDLEdBQVcsRUFBRSxVQUFnQyxFQUFFLE9BQTBCLEVBQUUsTUFBWTtRQUNySCxJQUFNLFVBQVUsR0FBUTtZQUNwQixJQUFJLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDO1NBQ3BFLENBQUE7UUFFRCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNwQixVQUFVLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ3JGLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNuQixVQUFVLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ25GLENBQUM7UUFFRCxNQUFNLENBQUMsVUFBVSxDQUFBO0lBQ3JCLENBQUM7SUFFYSxtQkFBSyxHQUFuQixVQUFvQixVQUFnQyxFQUFFLEtBQVUsRUFBRSxPQUEwQixFQUFFLE1BQVc7UUFDckcsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNLENBQUMsS0FBSyxDQUFBO1FBQ2hCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sVUFBVSxDQUFDLFVBQVUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7WUFDeEQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7WUFDakMsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsS0FBSyxDQUFBO0lBQ2hCLENBQUM7SUFDTCxvQkFBQztBQUFELENBaEVBLEFBZ0VDOztBQTlEa0IsbUJBQUssR0FBRztJQUNuQixJQUFJLEVBQUUsVUFBQyxLQUFVLEVBQUUsR0FBVyxFQUFFLFVBQWdDO1FBQzVELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxZQUFZLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvRSxNQUFNLENBQUM7Z0JBQ0gsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsSUFBSSxFQUFFLE1BQU07Z0JBQ1osT0FBTyxFQUFFLGNBQVksR0FBRywwQkFBdUI7YUFDbEQsQ0FBQTtRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUNELE1BQU0sRUFBRSxVQUFDLEtBQVUsRUFBRSxHQUFXLEVBQUUsVUFBZ0M7UUFDOUQsRUFBRSxDQUFDLENBQUMsS0FBSyxZQUFZLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0csTUFBTSxDQUFDO2dCQUNILFFBQVEsRUFBRSxHQUFHO2dCQUNiLElBQUksRUFBRSxNQUFNO2dCQUNaLE9BQU8sRUFBRSxjQUFZLEdBQUcsK0JBQTBCLFVBQVUsQ0FBQyxNQUFRO2FBQ3hFLENBQUE7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNmLENBQUM7SUFDRCxLQUFLLEVBQUUsVUFBQyxLQUFVLEVBQUUsR0FBVyxFQUFFLFVBQWdDO1FBQzdELEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFHLE1BQU0sQ0FBQztnQkFDSCxRQUFRLEVBQUUsR0FBRztnQkFDYixJQUFJLEVBQUUsTUFBTTtnQkFDWixPQUFPLEVBQUUsY0FBWSxHQUFHLDhCQUF5QixVQUFVLENBQUMsS0FBTzthQUN0RSxDQUFBO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0NBQ0osQ0FBQSIsImZpbGUiOiJ2YWxpZGF0b3JzL2RhdGUtdmFsaWRhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsXX0=

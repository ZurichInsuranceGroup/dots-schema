import isNaN from 'lodash.isnan';
import { cleaned } from '../cleaned';
import { min, max } from './common-rules';
var NumberValidator = (function () {
    function NumberValidator() {
    }
    NumberValidator.getValidatorsForKey = function (key, definition, options, object) {
        var validators = {
            type: cleaned(NumberValidator.RULES.type, key, definition, options)
        };
        if (typeof definition.min !== 'undefined') {
            validators.min = cleaned(NumberValidator.RULES.min, key, definition, options);
        }
        if (typeof definition.max !== 'undefined') {
            validators.max = cleaned(NumberValidator.RULES.max, key, definition, options);
        }
        return validators;
    };
    NumberValidator.clean = function (definition, value, options, object) {
        if (!options.castTypes) {
            return value;
        }
        if (typeof value === 'string') {
            var result = parseFloat(value);
            if (isNaN(result)) {
                return value;
            }
            value = result;
        }
        if (typeof value === 'number') {
            if (definition.decimal) {
                return value;
            }
            else {
                var rounding = definition.rounding ? definition.rounding : options.rounding;
                switch (rounding) {
                    case 'round':
                        return Math.round(value);
                    case 'floor':
                        return Math.floor(value);
                    case 'ceil':
                        return Math.ceil(value);
                }
            }
        }
        return value;
    };
    return NumberValidator;
}());
export { NumberValidator };
NumberValidator.RULES = {
    type: function (value, key, definition) {
        if ((typeof value !== 'undefined' && value !== null) && typeof value !== 'number') {
            return {
                property: key,
                rule: 'type',
                message: "Property " + key + " must be of type Number"
            };
        }
        return null;
    },
    min: min,
    max: max
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9kb3RzLXNjaGVtYS92YWxpZGF0b3JzL251bWJlci12YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sY0FBYyxDQUFBO0FBU2hDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUE7QUFDcEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUV6QztJQUFBO0lBa0VBLENBQUM7SUFqRGlCLG1DQUFtQixHQUFqQyxVQUFrQyxHQUFXLEVBQUUsVUFBZ0MsRUFBRSxPQUEwQixFQUFFLE1BQVk7UUFDckgsSUFBTSxVQUFVLEdBQVE7WUFDcEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQztTQUN0RSxDQUFBO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxVQUFVLENBQUMsR0FBRyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDeEMsVUFBVSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNqRixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxVQUFVLENBQUMsR0FBRyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDeEMsVUFBVSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNqRixDQUFDO1FBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQTtJQUNyQixDQUFDO0lBRWEscUJBQUssR0FBbkIsVUFBb0IsVUFBZ0MsRUFBRSxLQUFVLEVBQUUsT0FBMEIsRUFBRSxNQUFXO1FBQ3JHLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLEtBQUssQ0FBQTtRQUNoQixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFJLE1BQU0sR0FBVyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUE7WUFFdEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEIsTUFBTSxDQUFDLEtBQUssQ0FBQTtZQUNoQixDQUFDO1lBRUQsS0FBSyxHQUFHLE1BQU0sQ0FBQTtRQUNsQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM1QixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDckIsTUFBTSxDQUFDLEtBQUssQ0FBQTtZQUNoQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUE7Z0JBQzdFLE1BQU0sQ0FBQSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2QsS0FBSyxPQUFPO3dCQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUM1QixLQUFLLE9BQU87d0JBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQzVCLEtBQUssTUFBTTt3QkFDUCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDL0IsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQTtJQUNoQixDQUFDO0lBRUwsc0JBQUM7QUFBRCxDQWxFQSxBQWtFQzs7QUFoRWtCLHFCQUFLLEdBQUc7SUFDbkIsSUFBSSxFQUFFLFVBQUMsS0FBVSxFQUFFLEdBQVcsRUFBRSxVQUFnQztRQUM1RCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNoRixNQUFNLENBQUM7Z0JBQ0gsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsSUFBSSxFQUFFLE1BQU07Z0JBQ1osT0FBTyxFQUFFLGNBQVksR0FBRyw0QkFBeUI7YUFDcEQsQ0FBQTtRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUNELEdBQUcsS0FBQTtJQUNILEdBQUcsS0FBQTtDQUNOLENBQUEiLCJmaWxlIjoidmFsaWRhdG9ycy9udW1iZXItdmFsaWRhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsXX0=

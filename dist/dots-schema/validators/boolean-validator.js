import toLower from 'lodash.tolower';
import { cleaned } from '../cleaned';
var BooleanValidator = (function () {
    function BooleanValidator() {
    }
    BooleanValidator.getValidatorsForKey = function (key, definition, options, object) {
        return {
            type: cleaned(BooleanValidator.RULES.type, key, definition, options)
        };
    };
    BooleanValidator.clean = function (definition, value, options, object) {
        if (!options.castTypes || typeof value === 'undefined') {
            return value;
        }
        if (typeof value === 'string') {
            if (toLower(value) === 'false') {
                return false;
            }
        }
        else if (value) {
            return true;
        }
        else {
            return false;
        }
    };
    return BooleanValidator;
}());
export { BooleanValidator };
BooleanValidator.RULES = {
    type: function (value, key, definition) {
        if ((typeof value !== 'undefined' && value !== null) && typeof value !== 'boolean') {
            return {
                property: key,
                rule: 'type',
                message: "Property " + key + " must be of type Boolean"
            };
        }
        return null;
    }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9kb3RzLXNjaGVtYS92YWxpZGF0b3JzL2Jvb2xlYW4tdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sT0FBTyxNQUFNLGdCQUFnQixDQUFBO0FBUXBDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUE7QUFFcEM7SUFBQTtJQW9DQSxDQUFDO0lBckJpQixvQ0FBbUIsR0FBakMsVUFBa0MsR0FBVyxFQUFFLFVBQWdDLEVBQUUsT0FBMEIsRUFBRSxNQUFZO1FBQ3JILE1BQU0sQ0FBQztZQUNILElBQUksRUFBRSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQztTQUN2RSxDQUFBO0lBQ0wsQ0FBQztJQUVhLHNCQUFLLEdBQW5CLFVBQW9CLFVBQWdDLEVBQUUsS0FBVSxFQUFFLE9BQTBCLEVBQUUsTUFBVztRQUNyRyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNyRCxNQUFNLENBQUMsS0FBSyxDQUFBO1FBQ2hCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixNQUFNLENBQUMsS0FBSyxDQUFBO1lBQ2hCLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFNLENBQUMsSUFBSSxDQUFBO1FBQ2YsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQTtRQUNoQixDQUFDO0lBQ0wsQ0FBQztJQUVMLHVCQUFDO0FBQUQsQ0FwQ0EsQUFvQ0M7O0FBbENpQixzQkFBSyxHQUFHO0lBQ2xCLElBQUksRUFBRSxVQUFDLEtBQVUsRUFBRSxHQUFXLEVBQUUsVUFBZ0M7UUFDNUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDakYsTUFBTSxDQUFDO2dCQUNILFFBQVEsRUFBRSxHQUFHO2dCQUNiLElBQUksRUFBRSxNQUFNO2dCQUNaLE9BQU8sRUFBRSxjQUFZLEdBQUcsNkJBQTBCO2FBQ3JELENBQUE7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNmLENBQUM7Q0FDSixDQUFBIiwiZmlsZSI6InZhbGlkYXRvcnMvYm9vbGVhbi12YWxpZGF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGxdfQ==

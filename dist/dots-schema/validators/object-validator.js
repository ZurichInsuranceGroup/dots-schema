import { cleaned } from '../cleaned';
var ObjectValidator = (function () {
    function ObjectValidator() {
    }
    ObjectValidator.getValidatorsForKey = function (key, definition, options, object) {
        return {
            type: cleaned(ObjectValidator.RULES.type, key, definition, options)
        };
    };
    ObjectValidator.clean = function (definition, value, options, object) {
        return value;
    };
    return ObjectValidator;
}());
export { ObjectValidator };
ObjectValidator.RULES = {
    type: function (value, key, definition) {
        if ((typeof value !== 'undefined' && value !== null) && typeof value !== 'object') {
            return {
                property: key,
                rule: 'type',
                message: "Property " + key + " must be of type Object"
            };
        }
        return null;
    }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9kb3RzLXNjaGVtYS92YWxpZGF0b3JzL29iamVjdC12YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUVwQztJQUFBO0lBeUJBLENBQUM7SUFWaUIsbUNBQW1CLEdBQWpDLFVBQWtDLEdBQVcsRUFBRSxVQUFnQyxFQUFFLE9BQTBCLEVBQUUsTUFBWTtRQUNySCxNQUFNLENBQUM7WUFDSCxJQUFJLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDO1NBQ3RFLENBQUE7SUFDTCxDQUFDO0lBRWEscUJBQUssR0FBbkIsVUFBb0IsVUFBZ0MsRUFBRSxLQUFVLEVBQUUsT0FBMEIsRUFBRSxNQUFXO1FBQ3JHLE1BQU0sQ0FBQyxLQUFLLENBQUE7SUFDaEIsQ0FBQztJQUVMLHNCQUFDO0FBQUQsQ0F6QkEsQUF5QkM7O0FBdkJrQixxQkFBSyxHQUFHO0lBQ25CLElBQUksRUFBRSxVQUFDLEtBQVUsRUFBRSxHQUFXLEVBQUUsVUFBZ0M7UUFDNUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDaEYsTUFBTSxDQUFDO2dCQUNILFFBQVEsRUFBRSxHQUFHO2dCQUNiLElBQUksRUFBRSxNQUFNO2dCQUNaLE9BQU8sRUFBRSxjQUFZLEdBQUcsNEJBQXlCO2FBQ3BELENBQUE7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNmLENBQUM7Q0FDSixDQUFBIiwiZmlsZSI6InZhbGlkYXRvcnMvb2JqZWN0LXZhbGlkYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbF19

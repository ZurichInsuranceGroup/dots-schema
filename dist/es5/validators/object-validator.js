"use strict";
var cleaned_1 = require('../cleaned');
var ObjectValidator = (function () {
    function ObjectValidator() {
    }
    ObjectValidator.getValidatorsForKey = function (key, definition, options, object) {
        return {
            type: cleaned_1.cleaned(ObjectValidator.RULES.type, key, definition, options)
        };
    };
    ObjectValidator.clean = function (definition, value, options, object) {
        return value;
    };
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
    return ObjectValidator;
}());
exports.ObjectValidator = ObjectValidator;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZhbGlkYXRvcnMvb2JqZWN0LXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBU0Esd0JBQXdCLFlBRXhCLENBQUMsQ0FGbUM7QUFFcEM7SUFBQTtJQXlCQSxDQUFDO0lBVmlCLG1DQUFtQixHQUFqQyxVQUFrQyxHQUFXLEVBQUUsVUFBZ0MsRUFBRSxPQUEwQixFQUFFLE1BQVk7UUFDckgsTUFBTSxDQUFDO1lBQ0gsSUFBSSxFQUFFLGlCQUFPLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUM7U0FDdEUsQ0FBQTtJQUNMLENBQUM7SUFFYSxxQkFBSyxHQUFuQixVQUFvQixVQUFnQyxFQUFFLEtBQVUsRUFBRSxPQUFxQixFQUFFLE1BQVc7UUFDaEcsTUFBTSxDQUFDLEtBQUssQ0FBQTtJQUNoQixDQUFDO0lBckJjLHFCQUFLLEdBQUc7UUFDbkIsSUFBSSxFQUFFLFVBQUMsS0FBVSxFQUFFLEdBQVcsRUFBRSxVQUFnQztZQUM1RCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDaEYsTUFBTSxDQUFDO29CQUNILFFBQVEsRUFBRSxHQUFHO29CQUNiLElBQUksRUFBRSxNQUFNO29CQUNaLE9BQU8sRUFBRSxjQUFZLEdBQUcsNEJBQXlCO2lCQUNwRCxDQUFBO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUE7UUFDZixDQUFDO0tBQ0osQ0FBQTtJQVlMLHNCQUFDO0FBQUQsQ0F6QkEsQUF5QkMsSUFBQTtBQXpCWSx1QkFBZSxrQkF5QjNCLENBQUEiLCJmaWxlIjoidmFsaWRhdG9ycy9vYmplY3QtdmFsaWRhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnXG5cbmltcG9ydCB7XG4gICAgVmFsaWRhdGlvbkRlZmluaXRpb24sXG4gICAgVmFsaWRhdGlvblJlc3VsdCxcbiAgICBWYWxpZGF0aW9uT3B0aW9ucyxcbiAgICBDbGVhbk9wdGlvbnNcbn0gIGZyb20gJy4uL2ludGVyZmFjZXMnXG5pbXBvcnQgeyBDb21wb3NlZFZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICcuLi9jb21wb3NlZC12YWxpZGF0aW9uLXJlc3VsdCdcbmltcG9ydCB7IGNsZWFuZWQgfSBmcm9tICcuLi9jbGVhbmVkJ1xuXG5leHBvcnQgY2xhc3MgT2JqZWN0VmFsaWRhdG9yICB7XG5cbiAgICAgcHVibGljIHN0YXRpYyBSVUxFUyA9IHtcbiAgICAgICAgdHlwZTogKHZhbHVlOiBhbnksIGtleTogc3RyaW5nLCBkZWZpbml0aW9uOiBWYWxpZGF0aW9uRGVmaW5pdGlvbikgPT4ge1xuICAgICAgICAgICAgaWYgKCh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlICE9PSBudWxsKSAmJiB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgcnVsZTogJ3R5cGUnLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgUHJvcGVydHkgJHtrZXl9IG11c3QgYmUgb2YgdHlwZSBPYmplY3RgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VmFsaWRhdG9yc0ZvcktleShrZXk6IHN0cmluZywgZGVmaW5pdGlvbjogVmFsaWRhdGlvbkRlZmluaXRpb24sIG9wdGlvbnM6IFZhbGlkYXRpb25PcHRpb25zLCBvYmplY3Q/OiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6IGNsZWFuZWQoT2JqZWN0VmFsaWRhdG9yLlJVTEVTLnR5cGUsIGtleSwgZGVmaW5pdGlvbiwgb3B0aW9ucylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY2xlYW4oZGVmaW5pdGlvbjogVmFsaWRhdGlvbkRlZmluaXRpb24sIHZhbHVlOiBhbnksIG9wdGlvbnM6IENsZWFuT3B0aW9ucywgb2JqZWN0OiBhbnkpOiB2b2lkIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuXG59XG4iXX0=

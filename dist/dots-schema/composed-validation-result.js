var ComposedValidationResult = (function () {
    function ComposedValidationResult() {
        this.errors = [];
    }
    ComposedValidationResult.prototype.and = function (result, key, index) {
        if (key === void 0) { key = null; }
        if (index === void 0) { index = null; }
        if (result != null) {
            var prefix = key ? key + "." : '';
            var suffix = index !== null ? "." + index : '';
            if (result instanceof ComposedValidationResult) {
                for (var _i = 0, _a = result.getErrors(); _i < _a.length; _i++) {
                    var error = _a[_i];
                    var property = "" + prefix + error.property + suffix;
                    this.errors.push({
                        property: property,
                        rule: error.rule,
                        message: error.message
                    });
                }
            }
            else if (typeof result === 'object') {
                var error = result;
                var property = "" + prefix + error.property + suffix;
                this.errors.push({
                    property: property,
                    rule: error.rule,
                    message: error.message
                });
            }
        }
    };
    ComposedValidationResult.prototype.isValid = function () {
        return this.errors.length === 0;
    };
    ComposedValidationResult.prototype.getErrors = function () {
        return this.errors;
    };
    return ComposedValidationResult;
}());
export { ComposedValidationResult };
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kb3RzLXNjaGVtYS9jb21wb3NlZC12YWxpZGF0aW9uLXJlc3VsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtJQUVJO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7SUFDcEIsQ0FBQztJQUlNLHNDQUFHLEdBQVYsVUFBVyxNQUFpRCxFQUFFLEdBQXlCLEVBQUUsS0FBMkI7UUFBdEQsb0JBQUEsRUFBQSxVQUF5QjtRQUFFLHNCQUFBLEVBQUEsWUFBMkI7UUFDaEgsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBTSxNQUFNLEdBQUcsR0FBRyxHQUFNLEdBQUcsTUFBRyxHQUFHLEVBQUUsQ0FBQTtZQUNuQyxJQUFNLE1BQU0sR0FBRyxLQUFLLEtBQUssSUFBSSxHQUFHLE1BQUksS0FBTyxHQUFHLEVBQUUsQ0FBQTtZQUVoRCxFQUFFLENBQUMsQ0FBQyxNQUFNLFlBQVksd0JBQXdCLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxHQUFHLENBQUMsQ0FBYyxVQUFrQixFQUFsQixLQUFBLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBbEIsY0FBa0IsRUFBbEIsSUFBa0I7b0JBQS9CLElBQUksS0FBSyxTQUFBO29CQUNWLElBQU0sUUFBUSxHQUFHLEtBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBUSxDQUFBO29CQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFDYixRQUFRLEVBQUUsUUFBUTt3QkFDbEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO3dCQUNoQixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87cUJBQ3pCLENBQUMsQ0FBQTtpQkFDTDtZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDcEMsSUFBTSxLQUFLLEdBQUcsTUFBeUIsQ0FBQTtnQkFDdkMsSUFBTSxRQUFRLEdBQUcsS0FBRyxNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFRLENBQUE7Z0JBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNiLFFBQVEsRUFBRSxRQUFRO29CQUNsQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7b0JBQ2hCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztpQkFDekIsQ0FBQyxDQUFBO1lBQ04sQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRU0sMENBQU8sR0FBZDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUE7SUFDbkMsQ0FBQztJQUVNLDRDQUFTLEdBQWhCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDdEIsQ0FBQztJQUNMLCtCQUFDO0FBQUQsQ0F6Q0EsQUF5Q0MsSUFBQSIsImZpbGUiOiJjb21wb3NlZC12YWxpZGF0aW9uLXJlc3VsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbF19

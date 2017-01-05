"use strict";
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
exports.ComposedValidationResult = ComposedValidationResult;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvc2VkLXZhbGlkYXRpb24tcmVzdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQTtJQUVJO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7SUFDcEIsQ0FBQztJQUlNLHNDQUFHLEdBQVYsVUFBVyxNQUFpRCxFQUFFLEdBQXlCLEVBQUUsS0FBMkI7UUFBdEQsbUJBQXlCLEdBQXpCLFVBQXlCO1FBQUUscUJBQTJCLEdBQTNCLFlBQTJCO1FBQ2hILEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQU0sTUFBTSxHQUFHLEdBQUcsR0FBTSxHQUFHLE1BQUcsR0FBRyxFQUFFLENBQUE7WUFDbkMsSUFBTSxNQUFNLEdBQUcsS0FBSyxLQUFLLElBQUksR0FBRyxNQUFJLEtBQU8sR0FBRyxFQUFFLENBQUE7WUFFaEQsRUFBRSxDQUFDLENBQUMsTUFBTSxZQUFZLHdCQUF3QixDQUFDLENBQUMsQ0FBQztnQkFDN0MsR0FBRyxDQUFDLENBQWMsVUFBa0IsRUFBbEIsS0FBQSxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQWxCLGNBQWtCLEVBQWxCLElBQWtCLENBQUM7b0JBQWhDLElBQUksS0FBSyxTQUFBO29CQUNWLElBQU0sUUFBUSxHQUFHLEtBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBUSxDQUFBO29CQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFDYixRQUFRLEVBQUUsUUFBUTt3QkFDbEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO3dCQUNoQixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87cUJBQ3pCLENBQUMsQ0FBQTtpQkFDTDtZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDcEMsSUFBTSxLQUFLLEdBQUcsTUFBeUIsQ0FBQTtnQkFDdkMsSUFBTSxRQUFRLEdBQUcsS0FBRyxNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFRLENBQUE7Z0JBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNiLFFBQVEsRUFBRSxRQUFRO29CQUNsQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7b0JBQ2hCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztpQkFDekIsQ0FBQyxDQUFBO1lBQ04sQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRU0sMENBQU8sR0FBZDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUE7SUFDbkMsQ0FBQztJQUVNLDRDQUFTLEdBQWhCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDdEIsQ0FBQztJQUNMLCtCQUFDO0FBQUQsQ0F6Q0EsQUF5Q0MsSUFBQTtBQXpDWSxnQ0FBd0IsMkJBeUNwQyxDQUFBIiwiZmlsZSI6ImNvbXBvc2VkLXZhbGlkYXRpb24tcmVzdWx0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVmFsaWRhdGlvbkVycm9yLCBWYWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnLi9pbnRlcmZhY2VzJ1xuXG5leHBvcnQgY2xhc3MgQ29tcG9zZWRWYWxpZGF0aW9uUmVzdWx0IGltcGxlbWVudHMgVmFsaWRhdGlvblJlc3VsdCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBbXVxuICAgIH1cblxuICAgIHJlYWRvbmx5IGVycm9yczogVmFsaWRhdGlvbkVycm9yW11cblxuICAgIHB1YmxpYyBhbmQocmVzdWx0OiBWYWxpZGF0aW9uUmVzdWx0IHwgbnVsbCB8IFZhbGlkYXRpb25FcnJvciwga2V5OiBTdHJpbmcgfCBudWxsID0gbnVsbCwgaW5kZXg6IG51bWJlciB8IG51bGwgPSBudWxsKTogdm9pZCB7XG4gICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgcHJlZml4ID0ga2V5ID8gYCR7a2V5fS5gIDogJydcbiAgICAgICAgICAgIGNvbnN0IHN1ZmZpeCA9IGluZGV4ICE9PSBudWxsID8gYC4ke2luZGV4fWAgOiAnJ1xuXG4gICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgQ29tcG9zZWRWYWxpZGF0aW9uUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZXJyb3Igb2YgcmVzdWx0LmdldEVycm9ycygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5ID0gYCR7cHJlZml4fSR7ZXJyb3IucHJvcGVydHl9JHtzdWZmaXh9YFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGU6IGVycm9yLnJ1bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gcmVzdWx0IGFzIFZhbGlkYXRpb25FcnJvclxuICAgICAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5ID0gYCR7cHJlZml4fSR7ZXJyb3IucHJvcGVydHl9JHtzdWZmaXh9YFxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgIHJ1bGU6IGVycm9yLnJ1bGUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGlzVmFsaWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVycm9ycy5sZW5ndGggPT09IDBcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RXJyb3JzKCk6IFZhbGlkYXRpb25FcnJvcltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3JzXG4gICAgfVxufVxuIl19

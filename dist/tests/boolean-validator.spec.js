"use strict";
var chai_1 = require("chai");
var dots_schema_1 = require("../dots-schema");
describe('BooleanValidator', function () {
    it('can validate a number type', function () {
        var schema = new dots_schema_1.Schema({
            bool: {
                type: Boolean
            }
        });
        var result = schema.validate({
            bool: false
        });
        chai_1.expect(result).to.equal(null);
        result = schema.validate({
            bool: 1
        });
        chai_1.expect(result).not.to.equal(null);
        if (result) {
            chai_1.expect(result.getErrors().length).to.equal(1);
            var error = result.getErrors()[0];
            chai_1.expect(error.property).to.equal('bool');
            chai_1.expect(error.rule).to.equal('type');
        }
    });
    it('can clean a boolean', function () {
        var schema = new dots_schema_1.Schema({
            bool: {
                type: Boolean
            },
            bool2: {
                type: Boolean
            },
            bool3: {
                type: Boolean
            },
            bool4: {
                type: Boolean
            }
        });
        var result = schema.clean({
            bool: 'false',
            bool2: 1,
            bool3: null
        });
        chai_1.expect(result.bool).to.equal(false);
        chai_1.expect(result.bool2).to.equal(true);
        chai_1.expect(result.bool3).to.equal(false);
        chai_1.expect(result.bool4).to.be.an('undefined');
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0cy9ib29sZWFuLXZhbGlkYXRvci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw2QkFBNkI7QUFFN0IsOENBQXVDO0FBRXZDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtJQUV6QixFQUFFLENBQUMsNEJBQTRCLEVBQUU7UUFDN0IsSUFBTSxNQUFNLEdBQUcsSUFBSSxvQkFBTSxDQUFDO1lBQ3RCLElBQUksRUFBRTtnQkFDRixJQUFJLEVBQUUsT0FBTzthQUNoQjtTQUNKLENBQUMsQ0FBQTtRQUVGLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDekIsSUFBSSxFQUFFLEtBQUs7U0FDZCxDQUFDLENBQUE7UUFFRixhQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUU3QixNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNyQixJQUFJLEVBQUUsQ0FBQztTQUNWLENBQUMsQ0FBQTtRQUVGLGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNqQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBRSxDQUFDO1lBQ1YsYUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRTdDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUVqQyxhQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDdkMsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRXZDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtRQUN0QixJQUFNLE1BQU0sR0FBRyxJQUFJLG9CQUFNLENBQUM7WUFDdEIsSUFBSSxFQUFFO2dCQUNGLElBQUksRUFBRSxPQUFPO2FBQ2hCO1lBQ0QsS0FBSyxFQUFFO2dCQUNILElBQUksRUFBRSxPQUFPO2FBQ2hCO1lBQ0QsS0FBSyxFQUFFO2dCQUNILElBQUksRUFBRSxPQUFPO2FBQ2hCO1lBQ0QsS0FBSyxFQUFFO2dCQUNILElBQUksRUFBRSxPQUFPO2FBQ2hCO1NBQ0osQ0FBQyxDQUFBO1FBRUYsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUN0QixJQUFJLEVBQUUsT0FBTztZQUNiLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxFQUFFLElBQUk7U0FDZCxDQUFDLENBQUE7UUFFRixhQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbkMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ25DLGFBQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNwQyxhQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBRTlDLENBQUMsQ0FBQyxDQUFBO0FBRU4sQ0FBQyxDQUFDLENBQUEiLCJmaWxlIjoiYm9vbGVhbi12YWxpZGF0b3Iuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbF19

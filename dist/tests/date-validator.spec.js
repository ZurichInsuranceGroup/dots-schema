"use strict";
var moment = require("moment");
var chai_1 = require("chai");
var dots_schema_1 = require("../dots-schema");
describe('DateValidator', function () {
    it('can validate a date type', function () {
        var schema = new dots_schema_1.Schema({
            date: {
                type: Date,
                before: new Date(Date.now() + 1000),
                after: new Date(Date.now() - 1000)
            }
        });
        var result = schema.validate({
            date: new Date()
        });
        chai_1.expect(result).to.equal(null);
        result = schema.validate({
            date: 'test'
        });
        chai_1.expect(result).not.to.equal(null);
        if (result) {
            chai_1.expect(result.getErrors().length).to.equal(1);
            var error = result.getErrors()[0];
            chai_1.expect(error.property).to.equal('date');
            chai_1.expect(error.rule).to.equal('type');
        }
    });
    it('can clean a date', function () {
        var format = 'MM-DD-YYYY';
        var dateString = '07-25-1987';
        var date = moment(dateString, format).toDate();
        var schema = new dots_schema_1.Schema({
            date: {
                type: Date,
                dateFormat: format
            }
        });
        var result = schema.clean({
            date: dateString
        });
        chai_1.expect(result.date.getTime()).to.equal(date.getTime());
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0cy9kYXRlLXZhbGlkYXRvci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrQkFBaUM7QUFDakMsNkJBQTZCO0FBRTdCLDhDQUF1QztBQUV2QyxRQUFRLENBQUMsZUFBZSxFQUFFO0lBRXRCLEVBQUUsQ0FBQywwQkFBMEIsRUFBRTtRQUMzQixJQUFNLE1BQU0sR0FBRyxJQUFJLG9CQUFNLENBQUM7WUFDdEIsSUFBSSxFQUFFO2dCQUNGLElBQUksRUFBRSxJQUFJO2dCQUNWLE1BQU0sRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUNuQyxLQUFLLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQzthQUNyQztTQUNKLENBQUMsQ0FBQTtRQUVGLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDekIsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFO1NBQ25CLENBQUMsQ0FBQTtRQUVGLGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRTdCLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3JCLElBQUksRUFBRSxNQUFNO1NBQ2YsQ0FBQyxDQUFBO1FBRUYsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVCxhQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFN0MsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRWpDLGFBQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUN2QyxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDdkMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLGtCQUFrQixFQUFFO1FBQ25CLElBQU0sTUFBTSxHQUFHLFlBQVksQ0FBQTtRQUMzQixJQUFNLFVBQVUsR0FBRyxZQUFZLENBQUE7UUFDL0IsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUNoRCxJQUFNLE1BQU0sR0FBRyxJQUFJLG9CQUFNLENBQUM7WUFDdEIsSUFBSSxFQUFFO2dCQUNGLElBQUksRUFBRSxJQUFJO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ3JCO1NBQ0osQ0FBQyxDQUFBO1FBRUYsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUN0QixJQUFJLEVBQUUsVUFBVTtTQUNuQixDQUFDLENBQUE7UUFFRixhQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7SUFDMUQsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLENBQUMsQ0FBQSIsImZpbGUiOiJkYXRlLXZhbGlkYXRvci5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsXX0=

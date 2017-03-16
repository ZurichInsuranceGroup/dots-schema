"use strict";
var chai_1 = require("chai");
var dots_schema_1 = require("../dots-schema");
describe('ValidationOptions', function () {
    it('can forbid extra properties', function () {
        var schema = new dots_schema_1.Schema({
            string: {
                type: String
            }
        }, {
            allowExtras: false
        });
        var result = schema.validate({
            string: '123',
        });
        chai_1.expect(result).to.equal(null);
        result = schema.validate({
            string: '123',
            extra: 'extra'
        });
        chai_1.expect(result).not.to.equal(null);
        if (result) {
            chai_1.expect(result.getErrors().length).to.equal(1);
            var error = result.getErrors()[0];
            chai_1.expect(error.property).to.equal('extra');
            chai_1.expect(error.rule).to.equal('undefined');
        }
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0cy92YWxpZGF0aW9uLW9wdGlvbnMtc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNkJBQTZCO0FBRTdCLDhDQUF1QztBQUV2QyxRQUFRLENBQUMsbUJBQW1CLEVBQUU7SUFFMUIsRUFBRSxDQUFDLDZCQUE2QixFQUFFO1FBQzlCLElBQU0sTUFBTSxHQUFHLElBQUksb0JBQU0sQ0FBQztZQUN0QixNQUFNLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLE1BQU07YUFDZjtTQUNKLEVBQUU7WUFDQyxXQUFXLEVBQUUsS0FBSztTQUNyQixDQUFDLENBQUE7UUFFRixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3pCLE1BQU0sRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQTtRQUVGLGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRTdCLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3JCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsS0FBSyxFQUFFLE9BQU87U0FDakIsQ0FBQyxDQUFBO1FBRUYsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVCxhQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFN0MsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRWpDLGFBQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUN4QyxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDNUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFBO0FBRU4sQ0FBQyxDQUFDLENBQUEiLCJmaWxlIjoidmFsaWRhdGlvbi1vcHRpb25zLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGxdfQ==

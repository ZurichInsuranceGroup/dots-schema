"use strict";
var chai_1 = require("chai");
var dots_schema_1 = require("../dots-schema");
describe('SchemaValidator', function () {
    it('can validate a sub-schema', function () {
        var schema = new dots_schema_1.Schema({
            sub: {
                type: new dots_schema_1.Schema({
                    string: {
                        type: String
                    }
                })
            }
        });
        var result = schema.validate({
            sub: {
                string: '1'
            }
        });
        chai_1.expect(result).to.equal(null);
        result = schema.validate({
            sub: {}
        });
        chai_1.expect(result).not.to.equal(null);
        if (result) {
            chai_1.expect(result.getErrors().length).to.equal(1);
        }
    });
    it('can clean a sub-schema', function () {
        var schema = new dots_schema_1.Schema({
            sub: {
                type: new dots_schema_1.Schema({
                    string: {
                        type: String,
                        defaultValue: 'default'
                    }
                }),
                defaultValue: {}
            }
        });
        var result = schema.clean({
            sub: {
                string: 1
            }
        });
        chai_1.expect(result.sub.string).to.equal('1');
        result = schema.clean({});
        chai_1.expect(result.sub.string).to.equal('default');
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0cy9zY2hlbWEtdmFsaWRhdG9ycy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw2QkFBNkI7QUFFN0IsOENBQXVDO0FBRXZDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtJQUV4QixFQUFFLENBQUMsMkJBQTJCLEVBQUU7UUFDNUIsSUFBTSxNQUFNLEdBQUcsSUFBSSxvQkFBTSxDQUFDO1lBQ3RCLEdBQUcsRUFBRTtnQkFDRCxJQUFJLEVBQUUsSUFBSSxvQkFBTSxDQUFDO29CQUNiLE1BQU0sRUFBRTt3QkFDSixJQUFJLEVBQUUsTUFBTTtxQkFDZjtpQkFDSixDQUFDO2FBQ0w7U0FDSixDQUFDLENBQUE7UUFFRixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3pCLEdBQUcsRUFBRTtnQkFDRCxNQUFNLEVBQUUsR0FBRzthQUNkO1NBQ0osQ0FBQyxDQUFBO1FBRUYsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFN0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDckIsR0FBRyxFQUFFLEVBQUU7U0FDVixDQUFDLENBQUE7UUFFRixhQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDakMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUUsQ0FBQztZQUNWLGFBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNqRCxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsd0JBQXdCLEVBQUU7UUFDekIsSUFBTSxNQUFNLEdBQUcsSUFBSSxvQkFBTSxDQUFDO1lBQ3RCLEdBQUcsRUFBRTtnQkFDRCxJQUFJLEVBQUUsSUFBSSxvQkFBTSxDQUFDO29CQUNiLE1BQU0sRUFBRTt3QkFDSixJQUFJLEVBQUUsTUFBTTt3QkFDWixZQUFZLEVBQUUsU0FBUztxQkFDMUI7aUJBQ0osQ0FBQztnQkFDRixZQUFZLEVBQUUsRUFBRTthQUNuQjtTQUNKLENBQUMsQ0FBQTtRQUVGLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDdEIsR0FBRyxFQUFFO2dCQUNELE1BQU0sRUFBRSxDQUFDO2FBQ1o7U0FDSixDQUFDLENBQUE7UUFFRixhQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBRXZDLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRXpCLGFBQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDakQsQ0FBQyxDQUFDLENBQUE7QUFFTixDQUFDLENBQUMsQ0FBQSIsImZpbGUiOiJzY2hlbWEtdmFsaWRhdG9ycy5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsXX0=

export function min(value, key, definition) {
    if (typeof value === 'number' && typeof definition.min === 'number' && value < definition.min) {
        return {
            property: key,
            rule: 'min',
            message: "Property " + key + " must be greater than " + definition.min
        };
    }
    else if (typeof value === 'string' && typeof definition.min === 'number' && value.length < definition.min) {
        return {
            property: key,
            rule: 'min',
            message: "Property " + key + " must be shorter than " + definition.min
        };
    }
    return null;
}
export function max(value, key, definition) {
    if (typeof value === 'number' && typeof definition.max === 'number' && value > definition.max) {
        return {
            property: key,
            rule: 'max',
            message: "Property " + key + " must be greater than " + definition.max
        };
    }
    else if (typeof value === 'string' && typeof definition.max === 'number' && value.length > definition.max) {
        return {
            property: key,
            rule: 'max',
            message: "Property " + key + " must be longer than " + definition.max
        };
    }
    return null;
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9kb3RzLXNjaGVtYS92YWxpZGF0b3JzL2NvbW1vbi1ydWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxNQUFNLGNBQWMsS0FBVSxFQUFFLEdBQVcsRUFBRSxVQUFnQztJQUN6RSxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksT0FBTyxVQUFVLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDNUYsTUFBTSxDQUFDO1lBQ0gsUUFBUSxFQUFFLEdBQUc7WUFDYixJQUFJLEVBQUUsS0FBSztZQUNYLE9BQU8sRUFBRSxjQUFZLEdBQUcsOEJBQXlCLFVBQVUsQ0FBQyxHQUFLO1NBQ3BFLENBQUE7SUFDTCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxPQUFPLFVBQVUsQ0FBQyxHQUFHLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUcsTUFBTSxDQUFDO1lBQ0gsUUFBUSxFQUFFLEdBQUc7WUFDYixJQUFJLEVBQUUsS0FBSztZQUNYLE9BQU8sRUFBRSxjQUFZLEdBQUcsOEJBQXlCLFVBQVUsQ0FBQyxHQUFLO1NBQ3BFLENBQUE7SUFDTCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQTtBQUNmLENBQUM7QUFFRCxNQUFNLGNBQWMsS0FBVSxFQUFFLEdBQVcsRUFBRSxVQUFnQztJQUN6RSxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksT0FBTyxVQUFVLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDNUYsTUFBTSxDQUFDO1lBQ0gsUUFBUSxFQUFFLEdBQUc7WUFDYixJQUFJLEVBQUUsS0FBSztZQUNYLE9BQU8sRUFBRSxjQUFZLEdBQUcsOEJBQXlCLFVBQVUsQ0FBQyxHQUFLO1NBQ3BFLENBQUE7SUFDTCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxPQUFPLFVBQVUsQ0FBQyxHQUFHLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUcsTUFBTSxDQUFDO1lBQ0gsUUFBUSxFQUFFLEdBQUc7WUFDYixJQUFJLEVBQUUsS0FBSztZQUNYLE9BQU8sRUFBRSxjQUFZLEdBQUcsNkJBQXdCLFVBQVUsQ0FBQyxHQUFLO1NBQ25FLENBQUE7SUFDTCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQTtBQUNmLENBQUMiLCJmaWxlIjoidmFsaWRhdG9ycy9jb21tb24tcnVsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGxdfQ==

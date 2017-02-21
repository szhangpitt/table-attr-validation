module.exports =
function mapCellLambda (input) {
    return function (mapFn) {
        return function (twoDArray) {
            return twoDArray.map(function (row, ri) {
                return row.map(function (cell, ci) {
                    return mapFn(cell, ci, row, ri, input);
                })
            })
        }
    };
}
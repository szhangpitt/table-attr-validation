var get = require('lodash.get');
var mapCellLambda = require('./lambda/input-map-cell');
var configValueValidateLambda = require('./lambda/config-value-validate');
var flatten = require('./lambda/flatten');
var assignWith = require('lodash.assignwith');
var assign = require('lodash.assign');

function validateCellMapFn (cell, ci, row, ri, attrConfigs) {
    var newCell = attrConfigs.reduce(function (res, at, ai) {

        res.valid = res.valid || {};
        res.valid[at.name] =
            configValueValidateLambda(at)(
                get(cell, ['attr', at.name])
            );

        return res;
    }, {});

    return newCell;
}

module.exports.validateCells = validateCells;
function validateCells (attrConfigs, cellAttrs) {
    return mapCellLambda(attrConfigs)(validateCellMapFn)(cellAttrs);
}

function andAssign (empty, dst, bool) {
    return (!!dst && !!bool);
}

function reduce (cellValid2DArray) {
    return flatten(cellValid2DArray)
        .map(function getValidObj (cell) {
            return cell.valid;
        })
        .reduce(function logicAndAssign (accu, validMap) {
            var dstCopy = assign({}, accu);
            var ret = assignWith(dstCopy, validMap, andAssign);
            return ret;
        });
}

module.exports.validateCellsReduce = validateCellsReduce;
function validateCellsReduce (attrConfigs, cellAttrs) {
    return reduce(validateCells(attrConfigs, cellAttrs));
}



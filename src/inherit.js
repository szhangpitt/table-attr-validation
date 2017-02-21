var inputmapcell = require('./lambda/input-map-cell');
var merge = require('lodash.merge');

function fromRow (cell, ci, row, ri, rowAttrConfig_rowIndex) {
    var matchRowIndex = rowAttrConfig_rowIndex.rowIndex;

    return ri === matchRowIndex ?
        merge({}, cell, { attr: rowAttrConfig_rowIndex.rowAttrConfig })
        : cell;
}

function fromCol (cell, ci, row, ri, colAttrConfig_colIndex) {
    var matchColIndex = colAttrConfig_colIndex.colIndex;

    return ci === matchColIndex ?
        merge({}, cell, { attr: colAttrConfig_colIndex.colAttrConfig })
        : cell;
}

function fromTable (cell, ci, row, ri, tableAttrConfig) {
    return merge({}, cell, { attr: tableAttrConfig })
}

module.exports.inheritRow =
function inheritRow (rowAttrConfig, rowIndex, cellAttrs) {
    return inputmapcell({
        rowAttrConfig: rowAttrConfig,
        rowIndex: rowIndex,
    })(fromRow)(cellAttrs);
};

module.exports.inheritCol =
function inheritCol (colAttrConfig, colIndex, cellAttrs) {
    return inputmapcell({
        colAttrConfig: colAttrConfig,
        colIndex: colIndex,
    })(fromCol)(cellAttrs);
};

module.exports.inheritTable =
function inheritTable (tableAttrConfig, cellAttrs) {
    return inputmapcell(tableAttrConfig)(fromTable)(cellAttrs);
};

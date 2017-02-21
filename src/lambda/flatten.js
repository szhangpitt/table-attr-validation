module.exports = function flatten (twoDArray) {
    return twoDArray.reduce(function (oneDArray, row) {
        return oneDArray.concat(row);
    }, [])
};

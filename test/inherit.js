var f = require('./formatter');

var expect = require('chai').expect;
var validateCells = require('../src/validate').validateCells;
var debug = require('debug')('table-attr-validation:inherit');
var inheritRow = require('../src/inherit').inheritRow;
var inheritCol = require('../src/inherit').inheritCol;
var inheritTable = require('../src/inherit').inheritTable;

describe('API', function () {
    describe('/inherit', function () {
        var attrConfigs;
        var cellAttrs;

        beforeEach(function () {
            attrConfigs = [{
                name: 'country',
                required: true,
            }, {
                name: 'currency',
                required: true,
                values: ['USD', 'EUR', 'RMB'],
            }];

            cellAttrs = [
                // row 0
                [
                    //cell 0-0, undefined cell OK, must take an array item
                    undefined,

                    // cell 0-1
                    {
                        attr: { currency: 'euro'},
                    }
                ],
                // row 1
                [
                    // cell 1-0
                    {
                        attr: { country: 'ISO Country' },
                    },
                    // cell 1-1, undefined cell OK, must take an array item
                    undefined,
                ]
            ];
        });

        it(f('inheritRow', [
                'inheritRow(',
                '  rowAttr {name1: val2}',
                '  rowIndex,',
                '  cellAttrs[[ {attr: {name1: val1}} ]],',
                ') =>',
                '[[ {attr: {name1: val2}} at rowIndex ]]',
            ]),
            function () {
                var res = inheritRow(
                    { country: 'Full Name Country' },
                    0,
                    cellAttrs
                );

                debug('res', JSON.stringify(res, null, 2));

                expect(res).to.be.an('array');

                expect(res[0][0].attr['country']).to.equal('Full Name Country');
                expect(res[0][1].attr['country']).to.equal('Full Name Country');

                // should return new cell obj at matched rowIndex
                expect(res[0][0]).not.to.equal(cellAttrs[0][0]);
                expect(res[0][1]).not.to.equal(cellAttrs[0][1]);

                // should return original cell obj at unmatched rowIndex
                expect(res[1][0]).to.equal(cellAttrs[1][0]);
                expect(res[1][1]).to.equal(cellAttrs[1][1]);
                expect(res[1][0]).to.deep.equal(cellAttrs[1][0]);
                expect(res[1][1]).to.deep.equal(cellAttrs[1][1]);
            });

        it(f('inheritCol', [
                'inheritCol(',
                '  colAttr {name1: val2},',
                '  colIndex,',
                '  cellAttrs[[ {attr: {name1: val1}} ]]',
                ') =>',
                '[[ {attr: {name1: val2}} at colIndex ]]',
            ]),
            function () {
                var res = inheritCol(
                    { currency: 'RMB' },
                    1,
                    cellAttrs
                );

                debug('inheritCol res', JSON.stringify(res, null, 2));

                expect(res).to.be.an('array');

                expect(res[0][1].attr['currency']).to.equal('RMB');
                expect(res[1][1].attr['currency']).to.equal('RMB');

                // should return new obj at matched colIndex
                expect(res[0][1]).not.to.equal(cellAttrs[0][1]);
                expect(res[1][1]).not.to.equal(cellAttrs[1][1]);

                // should return original obj at unmatched colIndex
                expect(res[0][0]).to.equal(cellAttrs[0][0]);
                expect(res[1][0]).to.equal(cellAttrs[1][0]);
                expect(res[0][0]).to.deep.equal(cellAttrs[0][0]);
                expect(res[1][0]).to.deep.equal(cellAttrs[1][0]);
            });

        it(f('inheritTable', [
                'inheritTable(',
                '  tableAttr {name1: val2},',
                '  cellAttrs[[ {attr: {name1: val1}} ]]',
                ') =>',
                '[[ {attr: {name1: val2}} for all ]]',
            ]),
            function () {
                var res = inheritTable(
                    { currency: 'EUR' },
                    cellAttrs
                );

                debug('inheritTable res', JSON.stringify(res, null, 2));

                expect(res).to.be.an('array');

                expect(res[0][0].attr['currency']).to.equal('EUR');
                expect(res[0][1].attr['currency']).to.equal('EUR');
                expect(res[1][0].attr['currency']).to.equal('EUR');
                expect(res[1][1].attr['currency']).to.equal('EUR');

                // should return new obj at all cells
                expect(res[0][0]).not.to.equal(cellAttrs[0][0]);
                expect(res[0][1]).not.to.equal(cellAttrs[0][1]);
                expect(res[1][0]).not.to.equal(cellAttrs[1][0]);
                expect(res[1][1]).not.to.equal(cellAttrs[0][1]);
            });
    });
});

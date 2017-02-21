var f = require('./formatter');

var expect = require('chai').expect;
var inputMapCellLambda = require('../src/lambda/input-map-cell');
var configValueValidateLambda = require('../src/lambda/config-value-validate');
var debug = require('debug')('table-attr-validation:lambda');

describe('Utils', function () {
    describe('/lambda', function () {
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


        it(f('input-map-cell(input)(fn)([[ cell ]])', [
                'inputMapCellLambda(input)(fn)([[ cell ]])',
                '=>',
                '[[ cell|newCell <= fn(cell, ci, row, ri, input) ]]'
            ]),
            function () {
                var mapFn = function mapFn (cell, ci, row, ri, input) {
                    return cell === undefined ?
                        { mapped: true, empty: true, r: ri, c: ci, input: input }
                        : { mapped: true, empty: false, r: ri, c: ci, input: input }
                };

                var newCells = inputMapCellLambda('abc')(mapFn)(cellAttrs);
                debug('newCells', JSON.stringify(newCells, null, 2));

                expect(newCells).to.be.an('array');
                exp(newCells[0][0], true, 0, 0, 'abc');
                exp(newCells[0][1], false, 0, 1, 'abc');
                exp(newCells[1][0], false, 1, 0, 'abc');
                exp(newCells[1][1], true, 1, 1, 'abc');

                function exp (cell, empty, r, c, input) {
                    expect(cell.mapped).to.equal(true);
                    expect(cell.empty).to.equal(empty);
                    expect(cell.r).to.equal(r);
                    expect(cell.c).to.equal(c);
                    expect(cell.input).to.equal(input);
                }

            });

        it(f('config-value-validate(attrConfig)(attrValue)', [
                'configValueValidateLambda(attrConfig)(attrValue)',
                '=>',
                'true | false',
            ]),
            function () {
                var validCountry =
                configValueValidateLambda({
                    name: 'country',
                    required: true,
                });

                expect(validCountry('US')).to.equal(true);
                expect(validCountry(undefined)).to.equal(false);

                var validCurrency =
                configValueValidateLambda({
                    name: 'currency',
                    required: true,
                    values: ['USD', 'EUR', 'RMB'],
                });

                expect(validCurrency('USD')).to.equal(true);
                expect(validCurrency('GBP')).to.equal(false);
                expect(validCurrency(null)).to.equal(false);

                var validDate =
                configValueValidateLambda({
                    name: 'date',
                    required: false,
                });

                expect(validDate(null)).to.equal(true);
            });

    });
});

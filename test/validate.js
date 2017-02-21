var f = require('./formatter');

var expect = require('chai').expect;
var validateCells = require('../src/validate').validateCells;
var validateCellsReduce = require('../src/validate').validateCellsReduce;
var debug = require('debug')('table-attr-validation:validate');

describe('API', function () {
    describe('/validate', function () {
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


        it( f('validateCells', [
                'validateCells(cellAttributes [[ {attr: {name1: val1, ...}} ]], attrConfigs)',
                '=>',
                '[[ {valid: {name1: true, name2: false, ...}} ]]',
            ]),
            function () {
                var res = validateCells(attrConfigs, cellAttrs);
                debug('res', JSON.stringify(res, null, 2));

                expect(res).to.be.an('array');
                expect(res[0][0].valid['currency']).to.equal(false);
                expect(res[0][0].valid['country']).to.equal(false);
                expect(res[0][1].valid['currency']).to.equal(false);
                expect(res[0][1].valid['country']).to.equal(false);

                expect(res[1][0].valid['currency']).to.equal(false);
                expect(res[1][0].valid['country']).to.equal(true);
                expect(res[1][1].valid['currency']).to.equal(false);
                expect(res[1][1].valid['country']).to.equal(false);
            });

        it(f('validateCellsReduce', [
                'validateCellsReduce(attrConfigs, [[ cellAttrs ]])',
                '=>',
                '{name1: true, name2: false...}',
            ]),
            function () {
                var res = validateCellsReduce(attrConfigs, cellAttrs);
                debug('res', JSON.stringify(res, null, 2));

                expect(res).to.be.an('object');
                expect(res).to.have.property('country');
                expect(res).to.have.property('currency');
                expect(res.country).to.equal(false);
                expect(res.currency).to.equal(false);
            })
    });
});

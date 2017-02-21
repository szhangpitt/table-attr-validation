var f = require('./formatter');

var expect = require('chai').expect;

var inheritRow = require('../src/inherit').inheritRow;
var inheritCol = require('../src/inherit').inheritCol;
var inheritTable = require('../src/inherit').inheritTable;

var validateCells = require('../src/validate').validateCells;
var validateCellsReduce = require('../src/validate').validateCellsReduce;

var debug = require('debug')('table-attr-validation:use-case');

describe('Use cases', function () {
    describe('/', function () {
        var attrConfigs;
        var cellAttrs;
        var tableAttr;

        beforeEach(function () {

            tableAttr = {
                name: 'person',
                required: true,
            };

            attrConfigs = [
                tableAttr, {
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


        it(f('use case 1: highlight each cell', [
                'inheritCol/inheritRow/inheritTable',
                '-->',
                'validateCells',
                '=>',
                '[[ {valid: {name1: true, name2: false, ...}} ]]',
            ]),
            function () {
                var inherited = inheritTable(
                    { person: 'name' },
                    cellAttrs
                );

                var vc = validateCells(
                    attrConfigs,
                    inherited);

                debug('vc', JSON.stringify(vc, null, 2));

                vc
                .reduce(function (flat, row) {
                    return flat.concat(row);
                }, [])
                .map(function (cell) {
                    return cell.valid;
                })
                .forEach(function (valid) {
                    expect(valid).to.be.ok;

                    expect(valid).to.have.property('person');
                    expect(valid).to.have.property('country');
                    expect(valid).to.have.property('currency');

                    expect(valid.person).to.be.a('boolean');
                    expect(valid.country).to.be.a('boolean');
                    expect(valid.currency).to.be.a('boolean');
                });

            });

        it(f('use case 2: global attr alert', [
                'inheritCol/inheritRow/inheritTable',
                '-->',
                'validateCellsReduce',
                '=>',
                '{name1: true, name2: false, ...}',
            ]),
            function () {
                var inherited = inheritTable(
                    { person: 'firstname' },
                    cellAttrs
                );

                var vcr = validateCellsReduce(
                    attrConfigs,
                    inherited);

                debug('vcr', JSON.stringify(vcr, null, 2));

                expect(vcr).to.be.an('object');

                expect(vcr).to.have.property('person');
                expect(vcr).to.have.property('country');
                expect(vcr).to.have.property('currency');

                expect(vcr.person).to.be.a('boolean');
                expect(vcr.country).to.be.a('boolean');
                expect(vcr.currency).to.be.a('boolean');

                expect(vcr.person).to.equal(true);
                expect(vcr.country).to.equal(false);
                expect(vcr.currency).to.equal(false);

            });
    });
});

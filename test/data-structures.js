var expect = require('chai').expect;
var f = require('./formatter');

describe('Premise', function () {
    describe('data structure', function () {
        it(f('attrConfig', ['attrConfig {name, required[, values]}']),
            function () {
                var validAttrConfigs = [{
                    name: 'scale',
                    required: true,
                }, {
                    name: 'country',
                    required: true,
                }, {
                    name: 'date',
                    required: false,
                }, {
                    name: 'currency',
                    required: true,
                    values: ['USD', 'EUR', 'RMB'],
                }];

                validAttrConfigs.forEach(function (attrConfig) {
                    expect(attrConfig).to.have.property('name');
                    expect(attrConfig).to.have.property('required');

                    expect(attrConfig.name).to.be.a('string');
                    expect(attrConfig.required).to.be.oneOf([true, false]);
                    attrConfig.values && expect(attrConfig.values).to.be.an('array');
                });
            });

        it(f('cellData', ['cellData [ row[ cell{ attr{ name: value } } ] ]']),
            function () {
                var validCellData = [
                    // row 0
                    [
                        //cell 0-0, undefined cell OK, must take an array item
                        undefined,

                        // cell 0-1
                        {
                            attr: { currency: 'ISO Currency'},
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

                expect(validCellData).to.be.an('array');
                expect(validCellData[0]).to.be.an('array');
                expect(validCellData[1]).to.be.an('array');
                expect(validCellData[0].length).to.equal(2);
                expect(validCellData[1].length).to.equal(2);
                expect(validCellData[0][1]).to.have.property('attr');
                expect(validCellData[0][1].attr).to.have.property('currency');
            });
    });
});

const assert = require('node:assert/strict');

require('sucrase/register');

const {
  calculatePropertyProjections,
} = require('../src/components/calculator/hooks/usePropertyProjections.ts');
const {
  defaultCostStructure,
  defaultMarketData,
  defaultPropertyDetails,
} = require('../src/components/calculator/config/defaults.ts');

const OFFSET_FOR_TEST = 50_000;

const approxEqual = (actual, expected, tolerance = 1e-6) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Expected ${actual} to be within ${tolerance} of ${expected}`
  );
};

const runTest = (name, fn) => {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
};

runTest('base investment scenario snapshot remains stable', () => {
  const result = calculatePropertyProjections(
    defaultPropertyDetails,
    defaultMarketData,
    defaultCostStructure,
    OFFSET_FOR_TEST
  );
  const year1 = result.yearlyProjections.find((projection) => projection.year === 1);
  const finalYear = result.yearlyProjections[result.yearlyProjections.length - 1];

  assert.ok(year1, 'Expected to find year 1 projection');
  assert.ok(finalYear, 'Expected to find final year projection');

  assert.equal(result.yearlyProjections.length, 31);
  assert.equal(year1.propertyValue, 1_215_400);
  approxEqual(year1.yearlyInterestPaid, 61_998.36458386974);
  approxEqual(result.totalInterestSaved, 213_615.75733923828);
  assert.equal(result.yearsReducedFromLoan, 2);
  assert.equal(result.monthsReducedFromLoan, 11);
  approxEqual(result.finalCGTPayable, 376_603.1563228748);
  approxEqual(finalYear.netPosition, 1_141_090.145249453);
});

runTest('ppor scenario keeps tax and CGT at zero while tracking rent savings', () => {
  const pporDetails = {
    ...defaultPropertyDetails,
    isPPOR: true,
    isCGTExempt: true,
  };
  const result = calculatePropertyProjections(
    pporDetails,
    defaultMarketData,
    defaultCostStructure,
    OFFSET_FOR_TEST
  );
  const year1 = result.yearlyProjections.find((projection) => projection.year === 1);
  const year10 = result.yearlyProjections.find((projection) => projection.year === 10);

  assert.ok(year1, 'Expected to find year 1 projection');
  assert.ok(year10, 'Expected to find year 10 projection');

  assert.equal(year1.taxBenefit, 0);
  assert.equal(year1.taxableIncome, 0);
  assert.equal(year1.rentalIncome, 0);
  assert.equal(year1.rentSavings, 39_000);
  assert.equal(year10.cgtPayable, 0);
  assert.equal(result.finalCGTPayable, 0);
});

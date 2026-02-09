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
  assert.equal(year1.propertyValue, 772_500);
  approxEqual(year1.cashFlow, -21_515.59321376368);
  approxEqual(year1.modelCashFlow, -21_515.59321376368);
  approxEqual(year1.yearlyInterestPaid, 37_190.6228862801);
  approxEqual(result.totalInterestSaved, 182_035.72997558184);
  assert.equal(result.yearsReducedFromLoan, 4);
  assert.equal(result.monthsReducedFromLoan, 3);
  approxEqual(result.finalCGTPayable, 239_214.11957061593);
  approxEqual(finalYear.netPosition, 1_122_845.8983867185);
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

runTest('negative gearing quarantine accumulates losses and defers tax benefit', () => {
  const quarantinedDetails = {
    ...defaultPropertyDetails,
    noNegativeGearing: true,
    noNegativeGearingStartYear: 1,
  };
  const result = calculatePropertyProjections(
    quarantinedDetails,
    defaultMarketData,
    defaultCostStructure,
    OFFSET_FOR_TEST
  );
  const year1 = result.yearlyProjections.find((projection) => projection.year === 1);
  const year2 = result.yearlyProjections.find((projection) => projection.year === 2);
  const year30 = result.yearlyProjections.find((projection) => projection.year === 30);

  assert.ok(year1, 'Expected to find year 1 projection');
  assert.ok(year2, 'Expected to find year 2 projection');
  assert.ok(year30, 'Expected to find year 30 projection');

  assert.equal(year1.taxBenefit, 0);
  assert.equal(year1.taxableIncome, 0);
  assert.equal(year2.taxableIncome, 0);
  approxEqual(year1.quarantinedLosses, 14_915.6228862801);
  approxEqual(year2.quarantinedLosses, 28_392.535890079424);
  assert.ok(year30.quarantinedLossesUsed >= 0, 'Expected quarantined losses used to remain non-negative');
  approxEqual(result.finalCGTPayable, 239_214.11957061593);
});

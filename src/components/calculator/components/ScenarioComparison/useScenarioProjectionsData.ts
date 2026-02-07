import { useMemo } from 'react';
import { calculatePropertyProjections } from '../../hooks/usePropertyProjections';
import { Scenario } from '../../types/scenario';
import { calculateStampDuty } from '../../calculations/stampDuty';
import { calculateTransferFee } from '../../calculations/transferFee';

const MORTGAGE_REGISTRATION_FEE = 224;

export interface SensitivitySettings {
  interestRateDelta: number;
  rentIncreaseDelta: number;
  propertyGrowthDelta: number;
}

interface ScenarioPoint {
  netPosition: number;
  netPositionExRent?: number;
  afterTaxHolding: number;
  rentSavingsTotal?: number;
  offsetBalance: number;
  cumulativePrincipalPaid: number;
  netPositionLow?: number;
  netPositionHigh?: number;
}

type ProcessedScenarioDataPoint = {
  year: number;
} & Record<string, ScenarioPoint | null | number>;

export const useScenarioProjectionsData = (
  scenarios?: Scenario[],
  sensitivityEnabled: boolean = false,
  sensitivitySettings?: SensitivitySettings
) => {
    const safeScenarios = useMemo(() => scenarios ?? [], [scenarios]);
    const scenarioProjections = safeScenarios.map(scenario => {
        const stampDuty = calculateStampDuty(
          scenario.state.propertyDetails.purchasePrice,
          false,
          false,
          scenario.state.state
        );
        const transferFee = calculateTransferFee(
          scenario.state.propertyDetails.purchasePrice,
          scenario.state.state
        );
        const purchaseCosts = {
          ...scenario.state.costStructure.purchaseCosts,
          transferFee,
          stampDuty,
          mortgageRegistrationFee: MORTGAGE_REGISTRATION_FEE,
          total:
            scenario.state.costStructure.purchaseCosts.conveyancingFee +
            scenario.state.costStructure.purchaseCosts.buildingAndPestFee +
            transferFee +
            stampDuty +
            MORTGAGE_REGISTRATION_FEE,
          state: scenario.state.state,
        };
        const maintenanceCost = (scenario.state.propertyDetails.purchasePrice * scenario.state.costStructure.maintenancePercentage) / 100;
        const annualPropertyCosts =
          scenario.state.costStructure.waterCost +
          scenario.state.costStructure.ratesCost +
          maintenanceCost +
          scenario.state.costStructure.insuranceCost;
        const costStructure = {
          ...scenario.state.costStructure,
          purchaseCosts,
          maintenanceCost,
          annualPropertyCosts
        };
        const totalUpfrontCosts = scenario.state.propertyDetails.depositAmount + purchaseCosts.total;
        const calculatedOffset = Math.max(0, scenario.state.propertyDetails.availableSavings - totalUpfrontCosts);
        const offsetAmount = scenario.state.propertyDetails.manualOffsetAmount ?? calculatedOffset;

        const applySensitivity = (deltas: { interest: number; rent: number; growth: number }) => {
          const updatedPropertyDetails = {
            ...scenario.state.propertyDetails,
            interestRate: Math.max(0, scenario.state.propertyDetails.interestRate + deltas.interest),
            interestRateChanges: scenario.state.propertyDetails.interestRateChanges?.map((change) => ({
              ...change,
              rate: Math.max(0, change.rate + deltas.interest)
            }))
          };
          const updatedMarketData = {
            ...scenario.state.marketData,
            propertyGrowthRate: scenario.state.marketData.propertyGrowthRate + deltas.growth,
            rentIncreaseRate: scenario.state.marketData.rentIncreaseRate + deltas.rent
          };
          return { updatedPropertyDetails, updatedMarketData };
        };

        const baseProjections = calculatePropertyProjections(
          scenario.state.propertyDetails,
          scenario.state.marketData,
          costStructure,
          offsetAmount
        ).yearlyProjections;

        let lowProjections: typeof baseProjections | undefined;
        let highProjections: typeof baseProjections | undefined;
        if (sensitivityEnabled) {
          const interestDelta = sensitivitySettings?.interestRateDelta ?? 0;
          const rentDelta = sensitivitySettings?.rentIncreaseDelta ?? 0;
          const growthDelta = sensitivitySettings?.propertyGrowthDelta ?? 0;

          const { updatedPropertyDetails: lowPropertyDetails, updatedMarketData: lowMarketData } = applySensitivity({
            interest: interestDelta,
            rent: -rentDelta,
            growth: -growthDelta
          });
          lowProjections = calculatePropertyProjections(
            lowPropertyDetails,
            lowMarketData,
            costStructure,
            offsetAmount
          ).yearlyProjections;

          const { updatedPropertyDetails: highPropertyDetails, updatedMarketData: highMarketData } = applySensitivity({
            interest: -interestDelta,
            rent: rentDelta,
            growth: growthDelta
          });
          highProjections = calculatePropertyProjections(
            highPropertyDetails,
            highMarketData,
            costStructure,
            offsetAmount
          ).yearlyProjections;
        }

        return {
          scenarioId: scenario.id,
          isPPOR: scenario.state.propertyDetails.isPPOR,
          projections: baseProjections,
          lowProjections,
          highProjections
        }
      });

  return useMemo(() => {
    if (safeScenarios.length === 0) {
      return [];
    }

    const allYears = scenarioProjections
      .flatMap(scenario => scenario.projections.map(projection => projection.year))
      .reduce((acc, year) => acc.add(year), new Set<number>());
    const sortedYears = Array.from(allYears).sort((a, b) => a - b);

    const rentSavingsByScenario = new Map<string, Map<number, number>>();
    scenarioProjections.forEach((scenario) => {
      if (!scenario.isPPOR) return;
      let cumulative = 0;
      const totalsByYear = new Map<number, number>();
      scenario.projections.forEach((projection) => {
        cumulative += projection.rentSavings;
        totalsByYear.set(projection.year, cumulative);
      });
      rentSavingsByScenario.set(scenario.scenarioId, totalsByYear);
    });

    const processedData = sortedYears.map((year) => {
      const dataPoint: ProcessedScenarioDataPoint = { year };

      scenarioProjections.forEach((scenario) => {
        const projection = scenario.projections.find(item => item.year === year);
        if (projection) {
          const income = scenario.isPPOR ? projection.rentSavings : projection.rentalIncome;
          const afterTaxHolding = income - projection.yearlyExpenses + projection.taxBenefit;
          const rentSavingsTotal = scenario.isPPOR
            ? rentSavingsByScenario.get(scenario.scenarioId)?.get(year) ?? 0
            : 0;
          const lowProjection = scenario.lowProjections?.find(item => item.year === year);
          const highProjection = scenario.highProjections?.find(item => item.year === year);
          dataPoint[scenario.scenarioId] = {
            netPosition: projection.netPosition,
            netPositionExRent: scenario.isPPOR ? projection.netPosition - rentSavingsTotal : undefined,
            afterTaxHolding,
            rentSavingsTotal,
            offsetBalance: projection.offsetBalance,
            cumulativePrincipalPaid: projection.cumulativePrincipalPaid,
            netPositionLow: lowProjection?.netPosition,
            netPositionHigh: highProjection?.netPosition
          };
        } else {
          dataPoint[scenario.scenarioId] = null;
        }
      });

      return dataPoint;
    });

    return processedData;
  }, [safeScenarios, scenarioProjections]);
};

import { useMemo } from 'react';
import { calculatePropertyProjections } from '../../hooks/usePropertyProjections';
import { Scenario } from '../../types/scenario';
import { calculateStampDuty } from '../../calculations/stampDuty';
import { calculateTransferFee } from '../../calculations/transferFee';
import { calculateHomeBuyerBenefits } from '../../calculations/homeBuyerBenefits';
import { calculateEffectiveLMI } from '../../calculations/lmi';

const MORTGAGE_REGISTRATION_FEE = 224;

export interface SensitivitySettings {
  interestRateDelta: number;
  rentIncreaseDelta: number;
  propertyGrowthDelta: number;
}

export interface GraphDisplaySettings {
  includeInvestedFunds: boolean;
  includePPORRentSavings: boolean;
}

interface ScenarioPoint {
  netPosition: number;
  netPositionExRent?: number;
  graphNetPosition: number;
  afterTaxHolding: number;
  rentSavingsTotal?: number;
  offsetBalance: number;
  principalTotal: number;
  cumulativePrincipalPaid: number;
  graphNetPositionLow?: number;
  graphNetPositionHigh?: number;
}

type ProcessedScenarioDataPoint = {
  year: number;
} & Record<string, ScenarioPoint | null | number>;

export const useScenarioProjectionsData = (
  scenarios?: Scenario[],
  sensitivityEnabled: boolean = false,
  sensitivitySettings?: SensitivitySettings,
  graphDisplaySettings: GraphDisplaySettings = {
    includeInvestedFunds: false,
    includePPORRentSavings: true
  }
) => {
    const safeScenarios = useMemo(() => scenarios ?? [], [scenarios]);
    const scenarioProjections = safeScenarios.map(scenario => {
        const isFirstHomeBuyer =
          scenario.state.propertyDetails.isPPOR &&
          scenario.state.propertyDetails.homeBuyerType === 'first-home-buyer';
        const stampDutyBeforeConcessions = calculateStampDuty(
          scenario.state.propertyDetails.purchasePrice,
          false,
          false,
          scenario.state.state
        );
        const stampDuty = calculateStampDuty(
          scenario.state.propertyDetails.purchasePrice,
          scenario.state.propertyDetails.isPPOR,
          isFirstHomeBuyer,
          scenario.state.state
        );
        const benefits = calculateHomeBuyerBenefits({
          state: scenario.state.state,
          propertyDetails: scenario.state.propertyDetails,
          stampDutyBeforeConcessions,
          stampDutyAfterConcessions: stampDuty,
        });
        const transferFee = calculateTransferFee(
          scenario.state.propertyDetails.purchasePrice,
          scenario.state.state
        );
        const lmi = calculateEffectiveLMI(
          scenario.state.propertyDetails.purchasePrice,
          scenario.state.propertyDetails.depositAmount,
          scenario.state.propertyDetails.waiveLMI,
          scenario.state.propertyDetails.lmiCalculationMode,
          scenario.state.propertyDetails.manualLMIAmount
        );
        const purchaseCosts = {
          ...scenario.state.costStructure.purchaseCosts,
          transferFee,
          lmi,
          stampDutyBeforeConcessions: benefits.stampDutyBeforeConcessions,
          stampDutyConcession: benefits.stampDutyConcession,
          stampDuty,
          homeBuyerGrant: benefits.grantAmount,
          homeBuyerGrantProgram: benefits.grantProgram,
          homeBuyerGrantBlockedByPrecisionInputs: benefits.grantBlockedByPrecisionInputs,
          netPurchaseCostBenefits: benefits.netBenefit,
          mortgageRegistrationFee: MORTGAGE_REGISTRATION_FEE,
          total:
            scenario.state.costStructure.purchaseCosts.conveyancingFee +
            scenario.state.costStructure.purchaseCosts.buildingAndPestFee +
            transferFee +
            lmi +
            stampDuty +
            MORTGAGE_REGISTRATION_FEE -
            benefits.grantAmount,
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
        const offsetAmount = Math.max(0, scenario.state.propertyDetails.manualOffsetAmount ?? 0);

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
          depositAmount: scenario.state.propertyDetails.depositAmount,
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
    const lowRentSavingsByScenario = new Map<string, Map<number, number>>();
    const highRentSavingsByScenario = new Map<string, Map<number, number>>();
    scenarioProjections.forEach((scenario) => {
      if (!scenario.isPPOR) return;
      let cumulative = 0;
      const totalsByYear = new Map<number, number>();
      scenario.projections.forEach((projection) => {
        cumulative += projection.rentSavings;
        totalsByYear.set(projection.year, cumulative);
      });
      rentSavingsByScenario.set(scenario.scenarioId, totalsByYear);

      if (scenario.lowProjections) {
        let lowCumulative = 0;
        const lowTotalsByYear = new Map<number, number>();
        scenario.lowProjections.forEach((projection) => {
          lowCumulative += projection.rentSavings;
          lowTotalsByYear.set(projection.year, lowCumulative);
        });
        lowRentSavingsByScenario.set(scenario.scenarioId, lowTotalsByYear);
      }

      if (scenario.highProjections) {
        let highCumulative = 0;
        const highTotalsByYear = new Map<number, number>();
        scenario.highProjections.forEach((projection) => {
          highCumulative += projection.rentSavings;
          highTotalsByYear.set(projection.year, highCumulative);
        });
        highRentSavingsByScenario.set(scenario.scenarioId, highTotalsByYear);
      }
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
          const lowRentSavingsTotal = scenario.isPPOR
            ? lowRentSavingsByScenario.get(scenario.scenarioId)?.get(year) ?? 0
            : 0;
          const highRentSavingsTotal = scenario.isPPOR
            ? highRentSavingsByScenario.get(scenario.scenarioId)?.get(year) ?? 0
            : 0;
          const netPositionExRent = scenario.isPPOR ? projection.netPosition - rentSavingsTotal : projection.netPosition;
          const selectedNetPosition = graphDisplaySettings.includePPORRentSavings
            ? projection.netPosition
            : netPositionExRent;
          const principalTotal = scenario.depositAmount + projection.cumulativePrincipalPaid;
          const totalInvestedFunds = principalTotal + projection.offsetBalance;
          const graphNetPosition = graphDisplaySettings.includeInvestedFunds
            ? selectedNetPosition + totalInvestedFunds
            : selectedNetPosition;
          const lowNetPositionExRent = scenario.isPPOR && lowProjection
            ? lowProjection.netPosition - lowRentSavingsTotal
            : lowProjection?.netPosition;
          const highNetPositionExRent = scenario.isPPOR && highProjection
            ? highProjection.netPosition - highRentSavingsTotal
            : highProjection?.netPosition;
          const selectedLowNetPosition = graphDisplaySettings.includePPORRentSavings
            ? lowProjection?.netPosition
            : lowNetPositionExRent;
          const selectedHighNetPosition = graphDisplaySettings.includePPORRentSavings
            ? highProjection?.netPosition
            : highNetPositionExRent;
          const lowPrincipalTotal = lowProjection
            ? scenario.depositAmount + lowProjection.cumulativePrincipalPaid
            : 0;
          const highPrincipalTotal = highProjection
            ? scenario.depositAmount + highProjection.cumulativePrincipalPaid
            : 0;
          dataPoint[scenario.scenarioId] = {
            netPosition: projection.netPosition,
            netPositionExRent: scenario.isPPOR ? netPositionExRent : undefined,
            graphNetPosition,
            afterTaxHolding,
            rentSavingsTotal,
            offsetBalance: projection.offsetBalance,
            principalTotal,
            cumulativePrincipalPaid: projection.cumulativePrincipalPaid,
            graphNetPositionLow: selectedLowNetPosition === undefined
              ? undefined
              : (graphDisplaySettings.includeInvestedFunds
                ? selectedLowNetPosition + lowPrincipalTotal + (lowProjection?.offsetBalance ?? 0)
                : selectedLowNetPosition),
            graphNetPositionHigh: selectedHighNetPosition === undefined
              ? undefined
              : (graphDisplaySettings.includeInvestedFunds
                ? selectedHighNetPosition + highPrincipalTotal + (highProjection?.offsetBalance ?? 0)
                : selectedHighNetPosition)
          };
        } else {
          dataPoint[scenario.scenarioId] = null;
        }
      });

      return dataPoint;
    });

    return processedData;
  }, [graphDisplaySettings.includeInvestedFunds, graphDisplaySettings.includePPORRentSavings, safeScenarios, scenarioProjections]);
};

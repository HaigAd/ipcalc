import { useMemo } from 'react';
import { usePropertyProjections } from '../../hooks/usePropertyProjections';
import { Scenario } from '../../types/scenario';
import { calculateStampDuty } from '../../calculations/stampDuty';
import { calculateTransferFee } from '../../calculations/transferFee';

const MORTGAGE_REGISTRATION_FEE = 224;

export const useScenarioProjectionsData = (scenarios?: Scenario[]) => {
    const safeScenarios = scenarios ?? [];
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

        return {
          scenarioId: scenario.id,
          projections: usePropertyProjections(
            scenario.state.propertyDetails,
            scenario.state.marketData,
            costStructure,
            offsetAmount
          ).yearlyProjections
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

    const processedData = sortedYears.map(year => {
      const dataPoint: { year: number } & { [key: string]: { netPosition: number, afterTaxHolding: number } | null } = { year };

      scenarioProjections.forEach((scenario, index) => {
        const projection = scenario.projections.find(item => item.year === year);
        if (projection) {
          const afterTaxHolding = projection.rentalIncome - projection.yearlyExpenses + projection.taxBenefit;
          dataPoint[scenario.scenarioId] = {
            netPosition: projection.netPosition,
            afterTaxHolding
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

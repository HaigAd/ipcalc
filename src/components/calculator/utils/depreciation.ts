export type DepreciationMode = 'fixed' | 'manual' | 'file';

export interface YearlyDepreciation {
  capitalWorks: number;
  plantEquipment: number;
}

export interface DepreciationSchedule {
  mode: DepreciationMode;
  // For fixed mode
  fixedCapitalWorks?: number;
  fixedPlantEquipment?: number;
  // For manual and file modes
  yearlySchedule?: YearlyDepreciation[];
}

export function getDepreciation(schedule: DepreciationSchedule, year: number): YearlyDepreciation {
  if (!schedule) {
    return { capitalWorks: 0, plantEquipment: 0 };
  }

  switch (schedule.mode) {
    case 'fixed':
      return {
        capitalWorks: schedule.fixedCapitalWorks || 0,
        plantEquipment: schedule.fixedPlantEquipment || 0,
      };
    case 'manual':
    case 'file':
      if (schedule.yearlySchedule && schedule.yearlySchedule[year - 1]) {
        return schedule.yearlySchedule[year - 1];
      }
      return { capitalWorks: 0, plantEquipment: 0 };
    default:
      return { capitalWorks: 0, plantEquipment: 0 };
  }
}

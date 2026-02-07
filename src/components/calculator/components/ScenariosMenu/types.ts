import { Scenario } from '../../types/scenario';

export interface ScenariosMenuProps {
  scenarios: Scenario[];
  activeScenarioId: string | null;
  activeScenario: Scenario | undefined;
  hasChanges: boolean;
  onSave: (name: string) => void;
  onUpdate: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export interface ScenarioItemProps {
  scenario: Scenario;
  isActive: boolean;
  isEditing: boolean;
  editName: string;
  showGleam: string | null;
  onLoad: (id: string, name: string) => void;
  onDelete: (id: string, name: string) => void;
  onRename: (id: string) => void;
  setIsEditing: (id: string | null) => void;
  setEditName: (name: string) => void;
  triggerGleam: (id: string) => void;
}

export interface CreateScenarioProps {
  newScenarioName: string;
  setNewScenarioName: (name: string) => void;
  onSave: () => void;
  showGleam: string | null;
  triggerGleam: (id: string) => void;
}

export interface SaveChangesButtonProps {
  isSaving: boolean;
  showGleam: string | null;
  onUpdate: () => void;
  triggerGleam: (id: string) => void;
}

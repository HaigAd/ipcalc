import { useState } from 'react';
import { useToast } from '../../../../../components/ui/use-toast';
import { Scenario } from '../../../types/scenario';

interface UseScenariosMenuProps {
  onSave: (name: string) => void;
  onUpdate: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  activeScenario?: Scenario;
}

export const useScenariosMenu = ({
  onSave,
  onUpdate,
  onLoad,
  onDelete,
  onRename,
  activeScenario,
}: UseScenariosMenuProps) => {
  const [newScenarioName, setNewScenarioName] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showGleam, setShowGleam] = useState<string | null>(null);
  const { toast } = useToast();

  const triggerGleam = (id: string) => {
    setShowGleam(id);
    setTimeout(() => setShowGleam(null), 500);
  };

  const handleSave = () => {
    if (!newScenarioName.trim()) return;
    onSave(newScenarioName);
    setNewScenarioName('');
    toast({
      title: "Scenario Saved",
      description: `"${newScenarioName}" has been saved`,
    });
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    onUpdate();
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    toast({
      title: "Scenario Updated",
      description: `"${activeScenario?.name}" has been updated`,
    });
  };

  const handleLoad = (id: string, name: string) => {
    onLoad(id);
    toast({
      title: "Scenario Loaded",
      description: `"${name}" has been loaded`,
    });
  };

  const handleDelete = (id: string, name: string) => {
    onDelete(id);
    toast({
      title: "Scenario Deleted",
      description: `"${name}" has been deleted`,
      variant: "destructive",
    });
  };

  const handleRename = (id: string) => {
    if (!editName.trim()) return;
    onRename(id, editName);
    setIsEditing(null);
    setEditName('');
    toast({
      title: "Scenario Renamed",
      description: `Scenario has been renamed to "${editName}"`,
    });
  };

  return {
    newScenarioName,
    setNewScenarioName,
    isEditing,
    setIsEditing,
    editName,
    setEditName,
    isSaving,
    showGleam,
    triggerGleam,
    handleSave,
    handleUpdate,
    handleLoad,
    handleDelete,
    handleRename,
  };
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Button } from "../../../../components/ui/button";
import { FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonVariants, gleamVariants, activeScenarioVariants } from './animations';
import { ScenariosMenuProps } from './types';
import { useScenariosMenu } from './hooks/useScenariosMenu';
import { CreateScenario, ScenarioItem, SaveChangesButton } from './components';

const AnimatedButton = motion(Button);

export function ScenariosMenu({
  scenarios,
  activeScenarioId,
  activeScenario,
  hasChanges,
  onSave,
  onUpdate,
  onLoad,
  onDelete,
  onRename,
}: ScenariosMenuProps) {
  const {
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
  } = useScenariosMenu({
    onSave,
    onUpdate,
    onLoad,
    onDelete,
    onRename,
    activeScenario,
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 shrink-0"
    >
      <AnimatePresence mode="popLayout">
        {activeScenario && (
          <motion.div
            variants={activeScenarioVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="inline-flex h-9 max-w-[320px] items-center gap-2 rounded-md border border-sky-200 bg-sky-50 px-3 text-sm text-sky-900"
          >
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            <span className="text-sky-700">Editing:</span>
            <motion.span layout className="font-semibold text-sky-900 truncate">
              {activeScenario.name}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <AnimatedButton 
            variant="outline" 
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            data-tutorial="scenarios-menu-trigger"
            className="relative overflow-hidden flex items-center gap-2 px-3 py-2 h-9 border-slate-300 bg-white text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => triggerGleam('menu')}
          >
            <FolderOpen className="h-4 w-4 text-slate-600" />
            <span className="font-medium">Scenarios</span>
            <AnimatePresence>
              {showGleam === 'menu' && (
                <motion.div
                  variants={gleamVariants}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  style={{ mixBlendMode: 'overlay' }}
                />
              )}
            </AnimatePresence>
          </AnimatedButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80" align="start">
          <CreateScenario
            newScenarioName={newScenarioName}
            setNewScenarioName={setNewScenarioName}
            onSave={handleSave}
            showGleam={showGleam}
            triggerGleam={triggerGleam}
          />

          {scenarios.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-slate-700">Load Scenario</DropdownMenuLabel>
              <AnimatePresence mode="popLayout">
                {scenarios.map((scenario) => (
                  <motion.div
                    key={scenario.id}
                    layout
                    className="px-2 py-1.5"
                  >
                    <ScenarioItem
                      scenario={scenario}
                      isActive={activeScenarioId === scenario.id}
                      isEditing={isEditing === scenario.id}
                      editName={editName}
                      showGleam={showGleam}
                      onLoad={handleLoad}
                      onDelete={handleDelete}
                      onRename={handleRename}
                      setIsEditing={setIsEditing}
                      setEditName={setEditName}
                      triggerGleam={triggerGleam}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {activeScenario && hasChanges && (
        <SaveChangesButton
          isSaving={isSaving}
          showGleam={showGleam}
          onUpdate={handleUpdate}
          triggerGleam={triggerGleam}
        />
      )}
    </motion.div>
  );
}

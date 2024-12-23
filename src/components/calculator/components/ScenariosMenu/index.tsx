import React from 'react';
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
      className="flex items-center gap-2 flex-wrap"
    >
      <AnimatePresence mode="popLayout">
        {activeScenario && (
          <motion.div
            variants={activeScenarioVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center gap-2 flex-wrap"
          >
            <motion.div 
              layout
              className="text-sm bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 max-w-[200px] flex-1 truncate"
            >
              <span className="text-blue-600">Current:</span>{" "}
              <motion.span
                layout
                className="font-medium text-blue-700"
              >
                {activeScenario.name}
              </motion.span>
            </motion.div>

            {hasChanges && (
              <SaveChangesButton
                activeScenario={activeScenario}
                isSaving={isSaving}
                showGleam={showGleam}
                onUpdate={handleUpdate}
                triggerGleam={triggerGleam}
              />
            )}
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
            className="relative overflow-hidden flex items-center gap-2 px-4 py-2.5 h-auto bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200 text-sm md:text-base"
            onClick={() => triggerGleam('menu')}
          >
            <FolderOpen className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 ">Scenarios</span>
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
              <DropdownMenuLabel className="text-blue-700">Load Scenario</DropdownMenuLabel>
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
    </motion.div>
  );
}

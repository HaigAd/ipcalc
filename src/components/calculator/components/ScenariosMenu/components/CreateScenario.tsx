import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { DropdownMenuLabel } from '../../../../../components/ui/dropdown-menu';
import { Plus } from 'lucide-react';
import { buttonVariants, gleamVariants } from '../animations';
import { CreateScenarioProps } from '../types';

const AnimatedButton = motion(Button);

export function CreateScenario({
  newScenarioName,
  setNewScenarioName,
  onSave,
  showGleam,
  triggerGleam,
}: CreateScenarioProps) {
  return (
    <>
      <DropdownMenuLabel className="text-slate-700">Create New Scenario</DropdownMenuLabel>
      <div className="px-2 py-1.5 flex gap-2">
        <Input
          value={newScenarioName}
          onChange={(e) => setNewScenarioName(e.target.value)}
          placeholder="Scenario name"
          data-tutorial="scenario-name-input"
          className="h-8"
        />
        <AnimatedButton
          size="sm"
          data-tutorial="save-scenario-button"
          onClick={() => {
            onSave();
            triggerGleam('save-new');
          }}
          disabled={!newScenarioName.trim()}
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          className="relative overflow-hidden bg-green-500 hover:bg-green-600"
        >
          <Plus className="h-4 w-4" />
          <AnimatePresence>
            {showGleam === 'save-new' && (
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
      </div>
    </>
  );
}

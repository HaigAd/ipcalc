import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Edit2, Trash2, ArrowRight } from 'lucide-react';
import { buttonVariants, gleamVariants, scenarioItemHoverVariants, arrowVariants } from '../animations';
import { ScenarioItemProps } from '../types';

const AnimatedButton = motion(Button);

export function ScenarioItem({
  scenario,
  isActive,
  isEditing,
  editName,
  showGleam,
  onLoad,
  onDelete,
  onRename,
  setIsEditing,
  setEditName,
  triggerGleam,
}: ScenarioItemProps) {
  if (isEditing) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex gap-2"
      >
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="h-8"
        />
        <AnimatedButton
          size="sm"
          onClick={() => {
            onRename(scenario.id);
            triggerGleam(`rename-${scenario.id}`);
          }}
          disabled={!editName.trim()}
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          className="relative overflow-hidden bg-green-500 hover:bg-green-600"
        >
          Save
          <AnimatePresence>
            {showGleam === `rename-${scenario.id}` && (
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
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex items-center justify-between hover:bg-blue-50 rounded-md p-2 group transition-colors"
      variants={scenarioItemHoverVariants}
      whileHover="hover"
    >
      <motion.div 
        className="flex items-center gap-2 flex-grow cursor-pointer"
        onClick={() => {
          onLoad(scenario.id, scenario.name);
          triggerGleam(`load-${scenario.id}`);
        }}
        whileTap="tap"
        variants={buttonVariants}
      >
        <span className={`${isActive ? 'font-bold text-blue-700' : 'text-slate-700'}`}>
          {scenario.name}
        </span>
        <motion.div
          variants={arrowVariants}
          initial="initial"
          whileHover="hover"
        >
          <ArrowRight className="h-4 w-4 text-blue-500" />
        </motion.div>
      </motion.div>
      <div className="flex gap-2">
        <AnimatedButton
          size="sm"
          variant="ghost"
          onClick={() => {
            setIsEditing(scenario.id);
            setEditName(scenario.name);
            triggerGleam(`edit-${scenario.id}`);
          }}
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          className="relative overflow-hidden text-slate-600 hover:text-blue-600"
        >
          <Edit2 className="h-4 w-4" />
          <AnimatePresence>
            {showGleam === `edit-${scenario.id}` && (
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
        <AnimatedButton
          size="sm"
          variant="ghost"
          onClick={() => {
            onDelete(scenario.id, scenario.name);
            triggerGleam(`delete-${scenario.id}`);
          }}
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          className="relative overflow-hidden text-slate-600 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          <AnimatePresence>
            {showGleam === `delete-${scenario.id}` && (
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
    </motion.div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../../components/ui/button';
import { Save } from 'lucide-react';
import { buttonVariants, gleamVariants, saveChangesVariants } from '../animations';
import { SaveChangesButtonProps } from '../types';

const AnimatedButton = motion(Button);

export function SaveChangesButton({
  isSaving,
  showGleam,
  onUpdate,
  triggerGleam,
}: SaveChangesButtonProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={saveChangesVariants}
    >
      <AnimatedButton
        variant="outline"
        onClick={() => {
          onUpdate();
          triggerGleam('update');
        }}
        disabled={isSaving}
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        className={`
          relative overflow-hidden
          flex items-center gap-2 px-4 py-2.5 h-auto
          bg-gradient-to-b from-green-50 to-green-100 
          hover:from-green-100 hover:to-green-200 
          border-green-200 text-green-700
          transition-all duration-300
          ${isSaving ? 'opacity-80' : 'opacity-100'}
          text-sm md:text-base
        `}
      >
        <Save className={`h-4 w-4 text-green-600 transition-transform duration-300 ${isSaving ? 'scale-90' : 'scale-100'}`} />
        <span className="text-sm md:text-base">Save Changes</span>
        <AnimatePresence>
          {showGleam === 'update' && (
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

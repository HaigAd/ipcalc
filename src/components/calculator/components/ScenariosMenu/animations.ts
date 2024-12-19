export const buttonVariants = {
  tap: { scale: 0.95 },
  hover: { 
    y: -1, 
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: { type: "spring", stiffness: 400 }
  },
};

export const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 400 }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.2 }
  }
};

export const gleamVariants = {
  initial: { x: "-100%", opacity: 0 },
  animate: { 
    x: "100%", 
    opacity: [0, 1, 0],
    transition: { duration: 0.5, ease: "easeInOut" }
  },
};

export const scenarioItemHoverVariants = {
  initial: { x: 0 },
  hover: { x: 2 }
};

export const arrowVariants = {
  initial: { opacity: 0, x: -10 },
  hover: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 400 }
  }
};

export const activeScenarioVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const saveChangesVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

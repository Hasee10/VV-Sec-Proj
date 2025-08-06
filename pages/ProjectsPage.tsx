import { Projects } from "../components/Projects";
import { motion } from 'motion/react';

export function ProjectsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-16"
    >
      <Projects />
    </motion.div>
  );
}
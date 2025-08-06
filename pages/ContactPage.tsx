import { Contact } from "../components/Contact";
import { motion } from 'motion/react';

export function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-16"
    >
      <Contact />
    </motion.div>
  );
}
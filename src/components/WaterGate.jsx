import { motion, AnimatePresence } from "framer-motion";

export default function WaterGate({ needsWater, addWater }) {
  if (!needsWater) return null;

  return (
    <AnimatePresence>
      <motion.div ...>
        ...
      </motion.div>
    </AnimatePresence>
  );
}

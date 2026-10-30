import { motion } from "framer-motion";

interface LoadingScreenProps {
  label?: string;
}

export function LoadingScreen({ label = "LOADING..." }: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-background"
      role="status"
      aria-live="polite"
    >
      <p className="font-headline-md text-headline-md text-primary cursor-blink">{label}</p>
    </motion.div>
  );
}

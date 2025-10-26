import { motion } from "framer-motion";

export const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        className="relative w-24 h-24"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        {/* DNA Helix Animation */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M 20 10 Q 50 30, 80 10"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 20 30 Q 50 50, 80 30"
            stroke="hsl(var(--secondary))"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.path
            d="M 20 50 Q 50 70, 80 50"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.path
            d="M 20 70 Q 50 90, 80 70"
            stroke="hsl(var(--secondary))"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          
          {/* DNA dots */}
          {[10, 30, 50, 70].map((y, i) => (
            <motion.g key={i}>
              <motion.circle
                cx="20"
                cy={y}
                r="4"
                fill="hsl(var(--primary))"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
              <motion.circle
                cx="80"
                cy={y}
                r="4"
                fill="hsl(var(--secondary))"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 + 0.1 }}
              />
            </motion.g>
          ))}
        </svg>
      </motion.div>
      
      <motion.p
        className="mt-6 text-muted-foreground font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Analyzing patient data...
      </motion.p>
    </div>
  );
};

import { motion } from 'motion/react';
import { cn } from '../ui/utils';

interface CurvedElementProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'yellow' | 'green';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: 'w-20 h-20',
  md: 'w-32 h-32',
  lg: 'w-48 h-48',
  xl: 'w-64 h-64'
};

const variantClasses = {
  primary: 'bg-gradient-vespa',
  secondary: 'bg-gradient-vespa-pink',
  accent: 'bg-gradient-vespa-complex',
  yellow: 'bg-gradient-vespa-yellow',
  green: 'bg-gradient-vespa-green'
};

export function CurvedElement({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  animated = true,
  children 
}: CurvedElementProps) {
  return (
    <motion.div
      className={cn(
        'relative curve-element',
        sizeClasses[size],
        variantClasses[variant],
        animated && 'animate-curve-morph',
        'shadow-2xl',
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.23, 1, 0.320, 1] 
      }}
      whileHover={{ 
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.3 }
      }}
    >
      {children && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold z-10">
          {children}
        </div>
      )}
      <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />
    </motion.div>
  );
}

export function FloatingCurves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-20 right-10"
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <CurvedElement size="lg" variant="primary" animated />
      </motion.div>
      
      <motion.div
        className="absolute bottom-32 left-16"
        animate={{
          y: [20, -20, 20],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <CurvedElement size="md" variant="secondary" animated />
      </motion.div>
      
      <motion.div
        className="absolute top-1/2 left-1/4"
        animate={{
          x: [-30, 30, -30],
          y: [-10, 10, -10],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <CurvedElement size="sm" variant="accent" animated />
      </motion.div>
    </div>
  );
}
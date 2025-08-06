import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  variant?: 'slide' | 'fade' | '3d-rotate' | 'scale' | 'wave';
}

export function PageTransition({ children, variant = 'fade' }: PageTransitionProps) {
  const variants = {
    slide: {
      initial: { x: 300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -300, opacity: 0 },
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        opacity: { duration: 0.3 }
      }
    },
    fade: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { 
        duration: 0.5, 
        ease: [0.23, 1, 0.320, 1] 
      }
    },
    '3d-rotate': {
      initial: { 
        opacity: 0, 
        rotateY: -90, 
        scale: 0.8,
        transformPerspective: 1000 
      },
      animate: { 
        opacity: 1, 
        rotateY: 0, 
        scale: 1,
        transformPerspective: 1000 
      },
      exit: { 
        opacity: 0, 
        rotateY: 90, 
        scale: 0.8,
        transformPerspective: 1000 
      },
      transition: { 
        duration: 0.8, 
        ease: [0.23, 1, 0.320, 1] 
      }
    },
    scale: {
      initial: { scale: 0.8, opacity: 0, filter: 'blur(10px)' },
      animate: { scale: 1, opacity: 1, filter: 'blur(0px)' },
      exit: { scale: 1.1, opacity: 0, filter: 'blur(5px)' },
      transition: { 
        duration: 0.6, 
        ease: [0.23, 1, 0.320, 1] 
      }
    },
    wave: {
      initial: { 
        opacity: 0,
        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)'
      },
      animate: { 
        opacity: 1,
        clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)'
      },
      exit: { 
        opacity: 0,
        clipPath: 'polygon(0 0%, 100% 0%, 100% 0%, 0 0%)'
      },
      transition: { 
        duration: 0.8, 
        ease: [0.23, 1, 0.320, 1] 
      }
    }
  };

  const config = variants[variant];

  return (
    <motion.div
      initial={config.initial}
      animate={config.animate}
      exit={config.exit}
      transition={config.transition}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

// Enhanced layout for consistent page transitions
export function PageLayout({ 
  children, 
  className = '',
  variant = 'fade' 
}: { 
  children: ReactNode; 
  className?: string;
  variant?: PageTransitionProps['variant'];
}) {
  return (
    <PageTransition variant={variant}>
      <div className={`min-h-screen ${className}`}>
        {/* Animated background elements */}
        <motion.div
          className="fixed inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
          <motion.div
            className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-vespa-complex rounded-full opacity-10 blur-3xl"
            animate={{
              y: [-50, 50, -50],
              x: [-25, 25, -25],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-vespa-pink rounded-full opacity-10 blur-3xl"
            animate={{
              y: [50, -50, 50],
              x: [25, -25, 25],
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        <div className={`relative z-10 ${className}`}>
          {children}
        </div>
      </div>
    </PageTransition>
  );
}
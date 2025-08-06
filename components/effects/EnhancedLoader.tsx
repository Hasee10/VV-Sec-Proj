import { motion } from 'motion/react';

interface EnhancedLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'complex';
}

export function EnhancedLoader({ 
  text = "Loading...", 
  size = 'md',
  variant = 'default' 
}: EnhancedLoaderProps) {
  const sizeMap = {
    sm: { container: 'w-16 h-16', dot: 'w-3 h-3' },
    md: { container: 'w-24 h-24', dot: 'w-4 h-4' },
    lg: { container: 'w-32 h-32', dot: 'w-5 h-5' }
  };

  const { container, dot } = sizeMap[size];

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center space-x-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gradient-vespa"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'complex') {
    return (
      <div className="flex flex-col items-center space-y-6">
        <div className={`relative ${container}`}>
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-vespa-complex"
            style={{ 
              maskImage: 'linear-gradient(transparent 40%, black 60%)',
              WebkitMaskImage: 'linear-gradient(transparent 40%, black 60%)'
            }}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          
          {/* Middle ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent bg-gradient-vespa-pink"
            style={{ 
              maskImage: 'linear-gradient(transparent 60%, black 80%)',
              WebkitMaskImage: 'linear-gradient(transparent 60%, black 80%)'
            }}
            animate={{ rotate: -360 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          
          {/* Inner circle */}
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-vespa glass-3d"
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 20px rgba(99, 102, 241, 0.3)",
                "0 0 40px rgba(236, 72, 153, 0.5)",
                "0 0 20px rgba(99, 102, 241, 0.3)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Center logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-6 h-6 text-white font-bold text-xl"
              animate={{
                rotateY: [0, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              V
            </motion.div>
          </div>
        </div>
        
        {/* Loading text */}
        <motion.div
          className="text-white text-lg font-medium"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.div>
        
        {/* Progress dots */}
        <div className="flex space-x-2">
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-vespa-pink"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={`relative ${container}`}>
        {/* Spinning ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-vespa"
          style={{ 
            maskImage: 'linear-gradient(transparent 50%, black 70%)',
            WebkitMaskImage: 'linear-gradient(transparent 50%, black 70%)'
          }}
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        
        {/* Pulsing center */}
        <motion.div
          className={`absolute inset-6 rounded-full bg-gradient-vespa-pink ${dot}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {text && (
        <motion.p
          className="text-white/80 font-medium"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
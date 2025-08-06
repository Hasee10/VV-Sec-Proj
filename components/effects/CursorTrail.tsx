import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export function CursorTrail() {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      
      setTrail(prevTrail => {
        const newPoint: TrailPoint = {
          id: now,
          x: e.clientX,
          y: e.clientY,
          timestamp: now
        };

        // Keep only recent points (last 500ms)
        const filteredTrail = prevTrail.filter(point => now - point.timestamp < 500);
        return [...filteredTrail, newPoint].slice(-20); // Max 20 points
      });

      setIsMoving(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsMoving(false), 100);
    };

    const handleMouseLeave = () => {
      setTrail([]);
      setIsMoving(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {trail.map((point, index) => {
          const age = (Date.now() - point.timestamp) / 500;
          const opacity = Math.max(0, 1 - age);
          const scale = Math.max(0.2, 1 - age);

          return (
            <motion.div
              key={point.id}
              className="absolute"
              style={{
                left: point.x,
                top: point.y,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: opacity * 0.8,
                scale: scale,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div 
                className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400"
                style={{
                  boxShadow: `0 0 ${10 * scale}px rgba(99, 102, 241, ${opacity * 0.6})`,
                  filter: 'blur(0.5px)',
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Enhanced cursor dot */}
      {isMoving && (
        <motion.div
          className="fixed pointer-events-none z-50"
          animate={{
            x: trail[trail.length - 1]?.x || 0,
            y: trail[trail.length - 1]?.y || 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          style={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.div
            className="w-6 h-6 rounded-full bg-gradient-vespa-complex"
            animate={{
              scale: [1, 1.2, 1],
              rotate: 360,
            }}
            transition={{
              scale: {
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }
            }}
            style={{
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.6), 0 0 40px rgba(236, 72, 153, 0.4)',
              filter: 'blur(0.5px)',
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
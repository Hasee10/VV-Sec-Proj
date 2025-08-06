import { motion, useAnimation, useMotionValue, useTransform } from 'motion/react';
import { ReactNode, useState } from 'react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

// Enhanced Button with multiple interaction states
interface EnhancedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export function EnhancedButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false
}: EnhancedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const variants = {
    primary: 'bg-gradient-vespa hover:bg-gradient-vespa-complex',
    secondary: 'glass-3d border-white/20 text-white hover:bg-white/10',
    ghost: 'text-white hover:bg-white/5'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const handleClick = async () => {
    if (disabled || loading) return;
    
    await controls.start({
      scale: [1, 0.95, 1],
      transition: { duration: 0.2 }
    });
    
    onClick?.();
  };

  return (
    <motion.button
      className={`
        relative rounded-2xl font-semibold transition-all duration-300 
        ${variants[variant]} ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        overflow-hidden group
      `}
      animate={controls}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        boxShadow: disabled ? undefined : "0 20px 40px rgba(0, 0, 0, 0.3)"
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsPressed(true)}
      onTapEnd={() => setIsPressed(false)}
      onClick={handleClick}
      disabled={disabled}
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-2xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={isPressed ? { 
          scale: [0, 1.5], 
          opacity: [0.3, 0],
          transition: { duration: 0.6 }
        } : {}}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={isHovered ? { 
          x: '100%',
          transition: { duration: 0.8, ease: "easeInOut" }
        } : {}}
      />
      
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        <span>{children}</span>
      </span>
    </motion.button>
  );
}

// Enhanced Card with advanced interactions
interface EnhancedCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export function EnhancedCard({ 
  children, 
  className = '',
  hoverable = true,
  clickable = false,
  onClick
}: EnhancedCardProps) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        glass-3d rounded-3xl p-6 border border-white/10 relative overflow-hidden
        ${hoverable ? 'hover-lift-3d' : ''}
        ${clickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: 0.8, ease: [0.23, 1, 0.320, 1] }
      } : {}}
      style={{
        rotateX: hoverable ? rotateX : 0,
        rotateY: hoverable ? rotateY : 0,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      onMouseMove={hoverable ? handleMouseMove : undefined}
      onMouseLeave={hoverable ? handleMouseLeave : undefined}
      onClick={clickable ? onClick : undefined}
      whileHover={hoverable ? {
        scale: 1.02,
        transition: { duration: 0.3 }
      } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 bg-gradient-vespa-complex rounded-3xl"
        whileHover={{ opacity: hoverable ? 0.1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{
          x: '100%',
          transition: { duration: 1.5, ease: "easeInOut" }
        }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// Enhanced Text Reveal Animation
interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function TextReveal({ 
  children, 
  className = '',
  delay = 0,
  duration = 0.8
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const words = children.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-2"
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={isInView ? {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
              duration,
              delay: delay + i * 0.1,
              ease: [0.23, 1, 0.320, 1]
            }
          } : {}}
          style={{ transformStyle: "preserve-3d" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// Enhanced Icon with hover effects
interface EnhancedIconProps {
  children: ReactNode;
  size?: number;
  color?: string;
  hoverScale?: number;
  hoverRotate?: number;
  className?: string;
}

export function EnhancedIcon({ 
  children, 
  size = 24,
  color = 'currentColor',
  hoverScale = 1.1,
  hoverRotate = 0,
  className = ''
}: EnhancedIconProps) {
  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ color }}
      whileHover={{ 
        scale: hoverScale,
        rotate: hoverRotate,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        style={{ width: size, height: size }}
        animate={{
          filter: [
            "drop-shadow(0 0 0px rgba(99, 102, 241, 0))",
            "drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))",
            "drop-shadow(0 0 0px rgba(99, 102, 241, 0))"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
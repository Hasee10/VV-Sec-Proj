import { motion } from 'motion/react';
import { cn } from '../ui/utils';
import { LucideIcon } from 'lucide-react';

interface IsometricCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  variant?: 'blue' | 'yellow' | 'white' | 'purple' | 'green' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const variantClasses = {
  blue: {
    background: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
    text: 'text-white',
    icon: 'text-blue-200',
    glow: 'shadow-blue-500/25'
  },
  yellow: {
    background: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600',
    text: 'text-black',
    icon: 'text-yellow-800',
    glow: 'shadow-yellow-500/25'
  },
  white: {
    background: 'bg-gradient-to-br from-gray-100 via-white to-gray-200',
    text: 'text-black',
    icon: 'text-gray-600',
    glow: 'shadow-gray-500/25'
  },
  purple: {
    background: 'bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600',
    text: 'text-white',
    icon: 'text-purple-200',
    glow: 'shadow-purple-500/25'
  },
  green: {
    background: 'bg-gradient-to-br from-green-500 via-green-600 to-emerald-600',
    text: 'text-white',
    icon: 'text-green-200',
    glow: 'shadow-green-500/25'
  },
  pink: {
    background: 'bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600',
    text: 'text-white',
    icon: 'text-pink-200',
    glow: 'shadow-pink-500/25'
  }
};

const sizeClasses = {
  sm: 'w-48 h-48 p-4',
  md: 'w-64 h-64 p-6',
  lg: 'w-80 h-80 p-8'
};

export function IsometricCard({
  title,
  subtitle,
  description,
  icon: Icon,
  variant = 'blue',
  size = 'md',
  className,
  children,
  onClick
}: IsometricCardProps) {
  const variantStyle = variantClasses[variant];

  return (
    <motion.div
      className={cn(
        'relative card-isometric cursor-pointer group',
        'rounded-3xl overflow-hidden',
        variantStyle.background,
        variantStyle.glow,
        sizeClasses[size],
        'border border-white/20',
        className
      )}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        ease: [0.23, 1, 0.320, 1]
      }}
      whileHover={{ 
        y: -10,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      onClick={onClick}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Top section with icon */}
        {Icon && (
          <div className="flex justify-between items-start">
            <motion.div
              className={cn('p-3 rounded-2xl bg-white/10 backdrop-blur-sm', variantStyle.icon)}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Icon size={size === 'lg' ? 32 : size === 'md' ? 24 : 20} />
            </motion.div>
            {subtitle && (
              <span className={cn('text-xs opacity-70 font-medium', variantStyle.text)}>
                {subtitle}
              </span>
            )}
          </div>
        )}

        {/* Middle section with title and description */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.h3 
            className={cn(
              'font-bold mb-2',
              variantStyle.text,
              size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg'
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {title}
          </motion.h3>
          
          {description && (
            <motion.p 
              className={cn(
                'opacity-80 leading-relaxed',
                variantStyle.text,
                size === 'lg' ? 'text-base' : 'text-sm'
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Bottom section for children */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </div>

      {/* 3D border effect */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/10 pointer-events-none" />
      <div className="absolute -top-1 -left-1 w-full h-full rounded-3xl border border-white/5 pointer-events-none" />
    </motion.div>
  );
}

export function IsometricGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      'grid gap-6 perspective-container',
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      className
    )}>
      {children}
    </div>
  );
}
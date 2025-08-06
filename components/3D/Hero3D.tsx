import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowRight, Play } from 'lucide-react';
import { CurvedElement, FloatingCurves } from './CurvedElement';
import { cn } from '../ui/utils';

interface Hero3DProps {
  title: string;
  subtitle?: string;
  description: string;
  primaryCTA: {
    text: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    text: string;
    onClick: () => void;
  };
  badge?: string;
  className?: string;
}

export function Hero3D({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  badge,
  className
}: Hero3DProps) {
  return (
    <section className={cn('relative min-h-screen flex items-center overflow-hidden', className)}>
      {/* Animated background elements */}
      <FloatingCurves />
      
      {/* Main gradient orb */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(236,72,153,0.2) 50%, transparent 100%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.320, 1] }}
          >
            {badge && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Badge 
                  variant="outline" 
                  className="glass-3d border-white/20 text-white px-4 py-2 text-sm font-medium"
                >
                  {badge}
                </Badge>
              </motion.div>
            )}

            {subtitle && (
              <motion.p
                className="text-white/70 text-lg mb-4 font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {subtitle}
              </motion.p>
            )}

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="text-white block">{title.split(' ')[0]}</span>
              <span className="gradient-text-complex text-3d block">
                {title.split(' ').slice(1).join(' ')}
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-white/80 mb-8 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Button
                size="lg"
                className="btn-3d bg-gradient-vespa-pink hover:bg-gradient-vespa-complex text-white px-8 py-4 rounded-2xl text-lg font-semibold group"
                onClick={primaryCTA.onClick}
              >
                {primaryCTA.text}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              {secondaryCTA && (
                <Button
                  variant="outline"
                  size="lg"
                  className="glass-3d border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-2xl text-lg font-semibold group"
                  onClick={secondaryCTA.onClick}
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {secondaryCTA.text}
                </Button>
              )}
            </motion.div>

            {/* Stats or features */}
            <motion.div
              className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {[
                { label: 'Projects', value: '500+' },
                { label: 'Clients', value: '150+' },
                { label: 'Success Rate', value: '99%' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual Element */}
          <motion.div
            className="relative perspective-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.320, 1] }}
          >
            {/* Main 3D element */}
            <motion.div
              className="relative w-full max-w-md mx-auto"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Central curved element */}
              <div className="relative">
                <CurvedElement 
                  size="xl" 
                  variant="primary" 
                  className="mx-auto animate-gradient-shift"
                >
                  <motion.div
                    className="text-6xl font-bold text-white"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    ∞
                  </motion.div>
                </CurvedElement>

                {/* Orbiting elements */}
                <motion.div
                  className="absolute -top-4 -right-4"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <CurvedElement size="sm" variant="yellow" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6"
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  <CurvedElement size="sm" variant="green" />
                </motion.div>

                <motion.div
                  className="absolute top-1/2 -right-8"
                  animate={{ 
                    y: [-20, 20, -20],
                    rotate: [0, 180, 360] 
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-vespa-pink animate-pulse-glow-3d" />
                </motion.div>
              </div>
            </motion.div>

            {/* Additional floating elements */}
            <motion.div
              className="absolute top-10 left-10 w-4 h-4 rounded-full bg-gradient-vespa"
              animate={{
                y: [0, -30, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute bottom-20 right-16 w-3 h-3 rounded-full bg-gradient-vespa-yellow"
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
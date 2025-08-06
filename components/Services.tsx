import { motion } from 'motion/react';
import { Badge } from "./ui/badge";
import { IsometricCard, IsometricGrid } from './3D/IsometricCard';
import { Code, Smartphone, Palette, ShoppingCart, BarChart3, Zap, Brain, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Services() {
  const navigate = useNavigate();

  const services = [
    {
      icon: Code,
      title: "UX/UI DESIGN",
      subtitle: "2k",
      description: "Solved Problem Daily",
      variant: "blue" as const,
      details: "User-centered design with data-driven insights and modern aesthetics"
    },
    {
      icon: Smartphone,
      title: "Clean Code Quality Standards",
      subtitle: "Q-BEST",
      description: "Front-End Development",
      variant: "yellow" as const,
      details: "Scalable, maintainable code following industry best practices"
    },
    {
      icon: Palette,
      title: "Motion Design",
      subtitle: "9-BEST",
      description: "Modern Tools Skilled Work",
      variant: "white" as const,
      details: "Engaging animations and micro-interactions for better UX"
    },
    {
      icon: Brain,
      title: "AI Integration",
      subtitle: "AI-PWR",
      description: "Machine Learning Solutions",
      variant: "purple" as const,
      details: "Intelligent features powered by cutting-edge AI technology"
    },
    {
      icon: ShoppingCart,
      title: "E-Commerce",
      subtitle: "E-COM",
      description: "Conversion Optimized Stores",
      variant: "green" as const,
      details: "High-converting online stores with seamless user experience"
    },
    {
      icon: BarChart3,
      title: "Analytics & SEO",
      subtitle: "DATA",
      description: "Performance Tracking",
      variant: "pink" as const,
      details: "Data-driven insights and search engine optimization"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="outline" className="mb-4 bg-white/5 border-white/20 text-white">
            Our Services
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Digital Solutions for
            <br />
            <span className="gradient-text-complex text-3d">Modern Business</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            We provide comprehensive digital services that combine creativity, technology, 
            and strategy to deliver exceptional results for your business.
          </p>
        </motion.div>

        <IsometricGrid className="mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.6,
                ease: [0.23, 1, 0.320, 1]
              }}
            >
              <IsometricCard
                title={service.title}
                subtitle={service.subtitle}
                description={service.description}
                icon={service.icon}
                variant={service.variant}
                size="md"
                onClick={() => navigate('/services')}
              >
                <p className="text-xs opacity-70 mt-2">
                  {service.details}
                </p>
              </IsometricCard>
            </motion.div>
          ))}
        </IsometricGrid>

        {/* Process Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="glass-3d rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Our <span className="gradient-text-pink">Process</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Design", description: "User research and creative concepts" },
                { step: "02", title: "Development", description: "Clean code and modern frameworks" },
                { step: "03", title: "Maintenance", description: "Ongoing support and optimization" }
              ].map((phase, index) => (
                <motion.div
                  key={phase.step}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl font-bold gradient-text mb-3">{phase.step}</div>
                  <h4 className="text-lg font-semibold text-white mb-2">{phase.title}</h4>
                  <p className="text-white/70 text-sm">{phase.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.button
            className="btn-3d bg-gradient-vespa-complex text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:scale-105 transition-transform duration-300 group"
            onClick={() => navigate('/contact')}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Globe className="w-5 h-5 mr-2 inline-block group-hover:rotate-12 transition-transform" />
            Want to know more about us?
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
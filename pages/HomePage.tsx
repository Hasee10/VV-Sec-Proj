import { motion } from 'motion/react';
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { Projects } from "../components/Projects";
import { About } from "../components/About";
import { Contact } from "../components/Contact";
import { EnhancedCard, TextReveal, EnhancedButton } from "../components/effects/MicroInteractions";
import { ArrowRight, Sparkles, Zap, Rocket } from 'lucide-react';

export function HomePage() {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.320, 1] }}
    >
      {/* Enhanced Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.320, 1] }}
      >
        <Hero />
      </motion.section>

      {/* Enhanced Stats Section */}
      <motion.section 
        className="py-20 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "150+", label: "Projects Completed", icon: Rocket },
              { number: "98%", label: "Client Satisfaction", icon: Sparkles },
              { number: "50+", label: "AI Models Deployed", icon: Zap },
              { number: "24/7", label: "Support Available", icon: ArrowRight }
            ].map((stat, index) => (
              <EnhancedCard key={index} hoverable clickable>
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <motion.div
                    className="mb-4 flex justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="w-8 h-8 text-purple-400" />
                  </motion.div>
                  <motion.h3 
                    className="text-3xl md:text-4xl font-bold gradient-text-complex mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-white/70 font-medium">
                    <TextReveal delay={index * 0.1 + 0.4}>
                      {stat.label}
                    </TextReveal>
                  </p>
                </motion.div>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enhanced Services Section */}
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.320, 1] }}
      >
        <Services />
      </motion.section>

      {/* Enhanced Projects Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.23, 1, 0.320, 1] }}
      >
        <Projects />
      </motion.section>

      {/* Enhanced About Section */}
      <motion.section
        initial={{ opacity: 0, rotateY: -15 }}
        whileInView={{ opacity: 1, rotateY: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.2, duration: 1, ease: [0.23, 1, 0.320, 1] }}
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        <About />
      </motion.section>

      {/* Enhanced CTA Section */}
      <motion.section 
        className="py-20 relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.320, 1] }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EnhancedCard className="max-w-4xl mx-auto p-12" hoverable>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <TextReveal>
                  Ready to Transform Your Business?
                </TextReveal>
              </h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                <TextReveal delay={0.5}>
                  Join the AI revolution with VespaVerse. Let's build something extraordinary together.
                </TextReveal>
              </p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <EnhancedButton variant="primary" size="lg">
                  Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
                </EnhancedButton>
                <EnhancedButton variant="secondary" size="lg">
                  Schedule Consultation
                </EnhancedButton>
              </motion.div>
            </motion.div>
          </EnhancedCard>
        </div>
      </motion.section>

      {/* Enhanced Contact Section */}
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.320, 1] }}
      >
        <Contact />
      </motion.section>
    </motion.div>
  );
}
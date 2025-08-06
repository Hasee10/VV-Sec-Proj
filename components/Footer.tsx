import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Github, Linkedin, Instagram, ArrowUp, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'motion/react';

export function Footer() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    scrollToTop();
  };

  const footerSections = [
    {
      title: 'Services',
      links: [
        { name: 'Web Development', path: '/services' },
        { name: 'Mobile Development', path: '/services' },
        { name: 'UI/UX Design', path: '/services' },
        { name: 'E-commerce Solutions', path: '/services' },
        { name: 'Digital Marketing', path: '/services' }
      ]
    },
    {
      title: 'Industries',
      links: [
        { name: 'Fintech', path: '/about' },
        { name: 'Healthcare', path: '/about' },
        { name: 'E-commerce', path: '/about' },
        { name: 'SaaS', path: '/about' },
        { name: 'Cryptocurrency', path: '/about' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Success Stories', path: '/projects' },
        { name: 'Our People', path: '/about' },
        { name: 'Careers', path: '/about' },
        { name: 'Events', path: '/contact' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', path: '#' },
        { name: 'Case Studies', path: '/projects' },
        { name: 'Pricing', path: '/contact' },
        { name: 'Contact', path: '/contact' },
        { name: 'Support', path: '/contact' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  return (
    <footer className="relative border-t border-white/10">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Section */}
        <motion.div
          className="py-16 border-b border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Stay ahead of the curve
            </h3>
            <p className="text-white/70 mb-8 text-lg">
              Subscribe to our newsletter for the latest insights, trends, and exclusive content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/50 rounded-full"
              />
              <Button className="bg-gradient-vespa-pink text-white rounded-full hover:opacity-90 px-8">
                <Send className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <div 
                className="flex items-center space-x-3 mb-6 cursor-pointer group"
                onClick={() => handleNavigation('/')}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-vespa flex items-center justify-center group-hover:animate-pulse-glow">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="text-2xl font-bold text-white">VespaVerse</span>
              </div>

              <p className="text-white/70 mb-6 text-sm leading-relaxed">
                Transforming businesses through innovative subscription-based digital solutions. We craft cutting-edge applications that drive unstoppable growth and enhance user experiences.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-white/80">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>hello@vespaverse.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-white/80">
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-white/80">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>123 Innovation Street, Tech City</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg glass border border-white/10 hover:border-white/30 transition-all duration-200 flex items-center justify-center group hover-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4 text-white/70 group-hover:text-white" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {link.path.startsWith('#') ? (
                        <a
                          href={link.path}
                          className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <button
                          onClick={() => handleNavigation(link.path)}
                          className="text-sm text-white/60 hover:text-white transition-colors duration-200 text-left"
                        >
                          {link.name}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-white/60">
              © 2024 VespaVerse. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <motion.button
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-vespa text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover-glow"
          onClick={scrollToTop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      </div>
    </footer>
  );
}
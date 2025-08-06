import { motion } from 'motion/react';
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Home, Search, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CurvedElement } from '../components/3D/CurvedElement';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
      
      {/* Floating curved elements */}
      <motion.div
        className="absolute top-20 left-10"
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
        <CurvedElement size="md" variant="secondary" animated />
      </motion.div>
      
      <motion.div
        className="absolute bottom-20 right-16"
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
        <CurvedElement size="sm" variant="yellow" animated />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Icon */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.320, 1] }}
          >
            <div className="w-32 h-32 mx-auto glass-3d rounded-full flex items-center justify-center border border-white/20 hover-lift-3d">
              <AlertCircle className="w-16 h-16 text-red-400" />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Badge variant="outline" className="glass-3d border-white/20 text-white px-4 py-2">
              <Search className="w-4 h-4 mr-2" />
              Page Not Found
            </Badge>
          </motion.div>

          {/* 404 Title */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h1 className="text-8xl md:text-9xl font-bold mb-4">
              <span className="text-white">4</span>
              <span className="gradient-text-complex text-3d">0</span>
              <span className="text-white">4</span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for seems to have ventured into the digital void. 
              Let's get you back to the VespaVerse.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              size="lg"
              className="btn-3d bg-gradient-vespa-pink hover:bg-gradient-vespa-complex text-white px-8 py-4 rounded-2xl text-lg font-semibold group"
              onClick={() => navigate('/')}
            >
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Go Home
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="glass-3d border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-2xl text-lg font-semibold group"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            className="glass-3d rounded-3xl p-8 border border-white/10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Maybe you were looking for:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: 'Projects', path: '/projects' },
                { name: 'Contact', path: '/contact' },
              ].map((link, index) => (
                <motion.button
                  key={link.name}
                  className="text-white/70 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all duration-300 hover-lift-3d text-sm font-medium"
                  onClick={() => navigate(link.path)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
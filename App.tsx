import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { AboutPage } from "./pages/AboutPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ParticleSystem } from "./components/effects/ParticleSystem";
import { CursorTrail } from "./components/effects/CursorTrail";
import { EnhancedLoader } from "./components/effects/EnhancedLoader";
import { PageLayout } from "./components/effects/PageTransition";

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageLayout variant="3d-rotate">
            <HomePage />
          </PageLayout>
        } />
        <Route path="/services" element={
          <PageLayout variant="slide">
            <ServicesPage />
          </PageLayout>
        } />
        <Route path="/about" element={
          <PageLayout variant="scale">
            <AboutPage />
          </PageLayout>
        } />
        <Route path="/projects" element={
          <PageLayout variant="wave">
            <ProjectsPage />
          </PageLayout>
        } />
        <Route path="/contact" element={
          <PageLayout variant="fade">
            <ContactPage />
          </PageLayout>
        } />
        
        {/* Handle preview and development routes */}
        <Route path="/preview_page.html" element={
          <PageLayout variant="3d-rotate">
            <HomePage />
          </PageLayout>
        } />
        <Route path="/preview" element={
          <PageLayout variant="3d-rotate">
            <HomePage />
          </PageLayout>
        } />
        <Route path="/index.html" element={
          <PageLayout variant="3d-rotate">
            <HomePage />
          </PageLayout>
        } />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={
          <PageLayout variant="fade">
            <NotFoundPage />
          </PageLayout>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    // Set dark theme as default
    document.documentElement.classList.remove('light');
    
    // Handle development preview routes
    const currentPath = window.location.pathname;
    if (currentPath === '/preview_page.html' || currentPath === '/preview' || currentPath === '/index.html') {
      window.history.replaceState(null, '', '/');
    }

    // Detect if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShowEffects(!prefersReducedMotion);

    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <EnhancedLoader text="Welcome to VespaVerse" variant="complex" size="lg" />
        </motion.div>
        
        {/* Loading background effects */}
        <div className="fixed inset-0 -z-10">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-vespa-complex rounded-full opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [-50, 50, -50],
              y: [-30, 30, -30],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-vespa-pink rounded-full opacity-15 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [50, -50, 50],
              y: [30, -30, 30],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background relative">
        {/* Enhanced Effects Layer */}
        {showEffects && (
          <>
            <ParticleSystem 
              count={30} 
              size="sm" 
              speed="slow" 
              opacity={0.3}
              colors={['#6366f1', '#ec4899', '#06b6d4', '#eab308']}
            />
            <CursorTrail />
          </>
        )}
        
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Header />
          <main className="min-h-screen">
            <AnimatedRoutes />
          </main>
          <Footer />
        </motion.div>

        {/* Background Enhancement Layer */}
        <div className="fixed inset-0 -z-20">
          {/* Dynamic animated gradients */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"
            animate={{
              background: [
                "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent)",
                "radial-gradient(ellipse 80% 50% at 70% -10%, rgba(236, 72, 153, 0.12), transparent)",
                "radial-gradient(ellipse 80% 50% at 30% -15%, rgba(6, 182, 212, 0.10), transparent)",
                "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent)"
              ]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Floating orbs */}
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-vespa rounded-full opacity-10 blur-2xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-vespa-pink rounded-full opacity-10 blur-2xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-vespa-complex rounded-full opacity-15 blur-xl"
            animate={{
              x: [-40, 40, -40],
              y: [-60, 60, -60],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Performance monitor for development */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            className="fixed bottom-4 right-4 glass-3d rounded-lg p-2 text-xs text-white/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            Effects: {showEffects ? 'ON' : 'OFF'}
          </motion.div>
        )}
      </div>
    </Router>
  );
}
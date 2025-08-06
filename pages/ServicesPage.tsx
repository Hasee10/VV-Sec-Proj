import { Services } from "../components/Services";
import { DataVisualizationBackground } from "../components/BackgroundElements";
import { motion } from 'motion/react';
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowRight, CheckCircle, Star, TrendingUp, Users, Zap, Code, Smartphone, Palette, ShoppingCart, BarChart3, Globe, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ServicesPage() {
  const navigate = useNavigate();

  const serviceCategories = [
    {
      title: "Development Services",
      description: "Full-stack development with AI integration",
      services: [
        { name: "Web Development", price: "From $2,999/month", features: ["React/Next.js", "Node.js Backend", "AI Integration"] },
        { name: "Mobile Development", price: "From $3,999/month", features: ["React Native", "iOS/Android", "Cross-platform"] },
        { name: "API Development", price: "From $1,999/month", features: ["REST/GraphQL", "Microservices", "Real-time"] }
      ]
    },
    {
      title: "Design & UX",
      description: "User-centered design with data insights",
      services: [
        { name: "UI/UX Design", price: "From $1,999/month", features: ["User Research", "Prototyping", "Design Systems"] },
        { name: "Brand Identity", price: "From $999/month", features: ["Logo Design", "Brand Guidelines", "Marketing Assets"] },
        { name: "Design Systems", price: "From $1,499/month", features: ["Component Library", "Style Guide", "Documentation"] }
      ]
    },
    {
      title: "AI & Analytics",
      description: "Advanced AI solutions and data analytics",
      services: [
        { name: "AI Integration", price: "From $4,999/month", features: ["Machine Learning", "Natural Language Processing", "Computer Vision"] },
        { name: "Data Analytics", price: "From $2,499/month", features: ["Real-time Dashboards", "Predictive Analytics", "Business Intelligence"] },
        { name: "Automation", price: "From $1,999/month", features: ["Workflow Automation", "AI Chatbots", "Process Optimization"] }
      ]
    }
  ];

  const industryExpertise = [
    {
      icon: TrendingUp,
      name: "Fintech",
      description: "Secure financial platforms with AI-powered fraud detection",
      projects: "50+ Projects"
    },
    {
      icon: Shield,
      name: "Healthcare",
      description: "HIPAA-compliant solutions with predictive analytics",
      projects: "30+ Projects"
    },
    {
      icon: ShoppingCart,
      name: "E-commerce",
      description: "AI-driven recommendation engines and conversion optimization",
      projects: "75+ Projects"
    },
    {
      icon: Code,
      name: "SaaS",
      description: "Scalable platforms with intelligent user insights",
      projects: "100+ Projects"
    },
    {
      icon: Globe,
      name: "Enterprise",
      description: "Large-scale digital transformation solutions",
      projects: "25+ Projects"
    },
    {
      icon: Users,
      name: "Startups",
      description: "MVP development with rapid scaling capabilities",
      projects: "120+ Projects"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Discovery & Analysis",
      description: "AI-powered market research and technical assessment",
      duration: "1-2 weeks",
      deliverables: ["Technical Specification", "Project Roadmap", "Resource Allocation", "Risk Assessment"]
    },
    {
      step: "02",
      title: "Design & Prototyping",
      description: "User-centered design with data-driven decisions",
      duration: "2-3 weeks",
      deliverables: ["Wireframes", "UI Designs", "Interactive Prototype", "Design System"]
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "Agile development with continuous integration",
      duration: "4-8 weeks",
      deliverables: ["MVP Release", "Quality Assurance", "Performance Testing", "Security Audit"]
    },
    {
      step: "04",
      title: "Launch & Optimization",
      description: "Smart deployment with continuous monitoring",
      duration: "1-2 weeks",
      deliverables: ["Production Deployment", "Monitoring Setup", "Team Training", "Documentation"]
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Faster Time to Market",
      description: "AI-assisted development reduces project timelines by up to 40%",
      metric: "40% Faster"
    },
    {
      icon: TrendingUp,
      title: "Increased ROI",
      description: "Data-driven optimization delivers measurable business results",
      metric: "300% ROI"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Built-in security with compliance and best practices",
      metric: "99.9% Uptime"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Dedicated specialists with deep industry knowledge",
      metric: "50+ Experts"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-16 relative"
    >
      <DataVisualizationBackground />
      
      {/* Hero Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-4 bg-white/5 border-white/20 text-white">
              Our Services
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Complete <span className="gradient-text-complex">Digital Solutions</span>
              <br />
              <span className="text-white">for Modern Businesses</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              From AI-powered development to intelligent design systems, we provide comprehensive services that drive growth and innovation.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-vespa-pink text-white hover:opacity-90 rounded-full px-8"
              onClick={() => navigate('/contact')}
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Services />

      {/* Service Categories */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 bg-white/5 border-white/20 text-white">
              Service Packages
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Comprehensive <span className="gradient-text-pink">Service Packages</span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Choose from our carefully crafted service packages designed to meet your specific business needs and growth objectives.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-white/10 hover-lift h-full">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-3">{category.title}</h3>
                    <p className="text-white/70 mb-6">{category.description}</p>
                    
                    <div className="space-y-4">
                      {category.services.map((service, idx) => (
                        <div key={idx} className="border border-white/10 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-white">{service.name}</h4>
                            <span className="text-sm gradient-text font-medium">{service.price}</span>
                          </div>
                          <div className="space-y-1">
                            {service.features.map((feature, fidx) => (
                              <div key={fidx} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span className="text-white/70 text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 bg-white/5 border-white/20 text-white">
              Industry Expertise
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Deep <span className="gradient-text">Industry Knowledge</span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Our team brings specialized expertise across multiple industries, ensuring solutions that understand your unique challenges and opportunities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industryExpertise.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-white/10 hover-lift h-full group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-vespa flex items-center justify-center mb-4 group-hover:animate-pulse-glow">
                      <industry.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{industry.name}</h3>
                    <p className="text-white/70 text-sm mb-4">{industry.description}</p>
                    <Badge variant="outline" className="bg-white/5 border-white/20 text-white/80 text-xs">
                      {industry.projects}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 bg-white/5 border-white/20 text-white">
              Our Process
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              <span className="gradient-text-complex">Streamlined</span> Development Process
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Our proven methodology ensures efficient delivery while maintaining the highest quality standards.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-white/10 hover-lift">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl font-bold gradient-text opacity-50">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-white">{step.title}</h3>
                          <Badge variant="outline" className="bg-white/5 border-white/20 text-white/80 text-xs">
                            {step.duration}
                          </Badge>
                        </div>
                        <p className="text-white/70 mb-4">{step.description}</p>
                        <div className="space-y-2">
                          <h4 className="font-medium text-white text-sm">Key Deliverables:</h4>
                          {step.deliverables.map((deliverable, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-white/70 text-sm">{deliverable}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 bg-white/5 border-white/20 text-white">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Measurable <span className="gradient-text-pink">Business Impact</span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Our clients see real, measurable results that drive their business forward and create lasting competitive advantages.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-white/10 hover-lift text-center h-full group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-vespa flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-glow">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold gradient-text mb-2">{benefit.metric}</div>
                    <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                    <p className="text-white/70 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="glass rounded-3xl p-12 lg:p-16 border border-white/10 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Let's discuss how our AI-powered solutions can accelerate your growth and give you a competitive edge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-vespa-pink text-white hover:opacity-90 rounded-full px-8"
                  onClick={() => navigate('/contact')}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Your Project
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 rounded-full px-8"
                  onClick={() => navigate('/projects')}
                >
                  View Our Work
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
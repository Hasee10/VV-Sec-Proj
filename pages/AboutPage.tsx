import { About } from "../components/About";
import { GeometricBackground } from "../components/BackgroundElements";
import { motion } from 'motion/react';
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowRight, Users, Target, Lightbulb, Award, Globe, TrendingUp, Heart, Code, Zap, Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AboutPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "We embrace cutting-edge technologies and methodologies to deliver solutions that are ahead of the curve."
    },
    {
      icon: Users,
      title: "Client-Centric",
      description: "Every decision we make is driven by our commitment to delivering exceptional value to our clients."
    },
    {
      icon: Target,
      title: "Results-Driven",
      description: "We measure our success by the tangible impact we create for your business and users."
    },
    {
      icon: Heart,
      title: "Quality Obsessed",
      description: "We maintain the highest standards in everything we do, from code quality to user experience."
    }
  ];

  const team = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      experience: "15+ years",
      expertise: "AI Strategy, Product Vision",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Sarah Rodriguez",
      role: "CTO",
      experience: "12+ years",
      expertise: "Machine Learning, Architecture",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Marcus Thompson",
      role: "Head of Design",
      experience: "10+ years",
      expertise: "UX Research, Design Systems",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Emily Watson",
      role: "Lead AI Engineer",
      experience: "8+ years",
      expertise: "Deep Learning, NLP",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Company Founded",
      description: "Started with a vision to democratize AI-powered development"
    },
    {
      year: "2020",
      title: "First AI Integration",
      description: "Launched our first machine learning-powered application"
    },
    {
      year: "2021",
      title: "100 Projects Milestone",
      description: "Successfully delivered 100+ projects across various industries"
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded operations to serve clients across 40+ countries"
    },
    {
      year: "2023",
      title: "AI Platform Launch",
      description: "Launched our proprietary AI development platform"
    },
    {
      year: "2024",
      title: "Industry Recognition",
      description: "Recognized as a top digital agency by multiple industry publications"
    }
  ];

  const stats = [
    { value: "500+", label: "Projects Completed", description: "Across various industries" },
    { value: "150+", label: "Global Clients", description: "In 40+ countries" },
    { value: "50+", label: "AI Specialists", description: "Expert team members" },
    { value: "99.9%", label: "Client Satisfaction", description: "Based on client surveys" }
  ];

  const certifications = [
    { name: "AWS Advanced Consulting Partner", level: "Advanced" },
    { name: "Google Cloud Partner", level: "Premier" },
    { name: "Microsoft Gold Partner", level: "Gold" },
    { name: "ISO 27001 Certified", level: "Security" },
    { name: "SOC 2 Type II", level: "Compliance" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-16 relative"
    >
      <GeometricBackground />
      
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
              About VespaVerse
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Building the <span className="gradient-text-complex">Future</span>
              <br />
              <span className="text-white">of Digital Innovation</span>
            </h1>
            <p className="text-xl text-white/70 max-w-4xl mx-auto mb-8">
              We're a team of passionate technologists, designers, and strategists united by a common mission: to empower businesses with intelligent, scalable, and innovative digital solutions that drive real growth.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-vespa-pink text-white hover:opacity-90 rounded-full px-8"
              onClick={() => navigate('/contact')}
            >
              Work With Us
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 bg-white/5 border-white/20 text-white">
                Our Mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Democratizing <span className="gradient-text">AI-Powered Development</span>
              </h2>
              <p className="text-lg text-white/70 mb-6 leading-relaxed">
                We believe that every business, regardless of size, should have access to cutting-edge AI and machine learning capabilities. Our mission is to make advanced technology accessible, practical, and transformative for organizations worldwide.
              </p>
              <p className="text-white/70 leading-relaxed">
                Through our subscription-based model, we provide continuous innovation, expert support, and scalable solutions that grow with your business needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="glass border-white/10 hover-lift">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-lg bg-gradient-vespa flex items-center justify-center mb-4 animate-pulse-glow">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
                  <p className="text-white/70 leading-relaxed">
                    To be the global leader in AI-powered digital transformation, enabling businesses to achieve unprecedented growth through intelligent, adaptive, and user-centered technology solutions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 bg-white/5 border-white/20 text-white">
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              What <span className="gradient-text-pink">Drives Us</span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Our core values shape every decision we make and every solution we deliver.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
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
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-3">{value.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-12 border border-white/10">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-bold gradient-text-complex mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white font-medium mb-1">{stat.label}</div>
                  <div className="text-white/60 text-sm">{stat.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 bg-white/5 border-white/20 text-white">
              <Users className="w-4 h-4 mr-2" />
              Our Team
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Meet the <span className="gradient-text">Innovators</span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Our diverse team of experts brings together decades of experience in AI, development, design, and business strategy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-white/10 hover-lift overflow-hidden group">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-white/60 text-sm mb-2">{member.role}</p>
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline" className="bg-white/5 border-white/20 text-white/80">
                        {member.experience}
                      </Badge>
                    </div>
                    <p className="text-white/70 text-xs mt-3">{member.expertise}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 bg-white/5 border-white/20 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Our Journey
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              <span className="gradient-text-complex">Milestones</span> & Achievements
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              From startup to industry leader, here's how we've grown and evolved over the years.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-vespa flex items-center justify-center animate-pulse-glow">
                      <span className="text-white font-bold">{milestone.year}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Card className="glass border-white/10 hover-lift">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                        <p className="text-white/70">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 bg-white/5 border-white/20 text-white">
              <Award className="w-4 h-4 mr-2" />
              Certifications & Partnerships
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Trusted <span className="gradient-text-pink">Technology Partners</span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Our certifications and partnerships ensure we deliver solutions using the latest technologies and best practices.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-white/10 hover-lift text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-vespa flex items-center justify-center mx-auto mb-4">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-sm">{cert.name}</h3>
                    <Badge variant="outline" className="bg-white/5 border-white/20 text-white/80 text-xs">
                      {cert.level}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <About />

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
                Ready to Build Something <span className="gradient-text-complex">Amazing</span>?
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Let's discuss how our team can help you achieve your digital transformation goals.
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
                  <Globe className="w-5 h-5 mr-2" />
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
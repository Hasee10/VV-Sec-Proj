import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      title: 'EcoShop E-commerce Platform',
      description: 'A sustainable shopping platform with advanced inventory management and AI-powered recommendations.',
      category: 'ecommerce',
      tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      beforeImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      liveUrl: '#',
      githubUrl: '#',
      impact: {
        metric1: { label: 'Sales Increase', value: '+250%' },
        metric2: { label: 'User Engagement', value: '+180%' },
        metric3: { label: 'Page Load Time', value: '-65%' }
      }
    },
    {
      id: 2,
      title: 'HealthTech Mobile App',
      description: 'A comprehensive health monitoring app with real-time data sync and telehealth features.',
      category: 'mobile',
      tags: ['React Native', 'Firebase', 'WebRTC', 'Chart.js'],
      beforeImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
      liveUrl: '#',
      githubUrl: '#',
      impact: {
        metric1: { label: 'User Retention', value: '+220%' },
        metric2: { label: 'Session Duration', value: '+150%' },
        metric3: { label: 'App Store Rating', value: '4.9/5' }
      }
    },
    {
      id: 3,
      title: 'FinanceFlow Dashboard',
      description: 'Real-time financial analytics dashboard with advanced reporting and data visualization.',
      category: 'web',
      tags: ['Next.js', 'TypeScript', 'D3.js', 'Redis'],
      beforeImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      liveUrl: '#',
      githubUrl: '#',
      impact: {
        metric1: { label: 'Data Processing', value: '+400%' },
        metric2: { label: 'Report Generation', value: '-80%' },
        metric3: { label: 'User Satisfaction', value: '98%' }
      }
    },
    {
      id: 4,
      title: 'EduConnect Learning Platform',
      description: 'Interactive online learning platform with video streaming and progress tracking.',
      category: 'web',
      tags: ['React', 'Node.js', 'MongoDB', 'WebRTC'],
      beforeImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
      liveUrl: '#',
      githubUrl: '#',
      impact: {
        metric1: { label: 'Student Engagement', value: '+300%' },
        metric2: { label: 'Course Completion', value: '+190%' },
        metric3: { label: 'Platform Uptime', value: '99.9%' }
      }
    }
  ];

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Apps' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'ecommerce', label: 'E-commerce' }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const handleStartProject = () => {
    navigate('/contact');
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4">Our Projects</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transformative <span className="gradient-text">Digital Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how we've helped businesses achieve remarkable growth through innovative technology solutions.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap gap-2 p-1 bg-card rounded-lg border">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover-lift group">
                <CardContent className="p-0">
                  {/* Before/After Images */}
                  <div className="relative">
                    <Tabs defaultValue="before" className="w-full">
                      <TabsList className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm">
                        <TabsTrigger value="before" className="text-xs">Before</TabsTrigger>
                        <TabsTrigger value="after" className="text-xs">After</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="before" className="m-0">
                        <div className="relative h-64 overflow-hidden">
                          <ImageWithFallback
                            src={project.beforeImage}
                            alt={`${project.title} - Before`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="after" className="m-0">
                        <div className="relative h-64 overflow-hidden">
                          <ImageWithFallback
                            src={project.afterImage}
                            alt={`${project.title} - After`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4">{project.description}</p>

                    {/* Impact Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold gradient-text">{project.impact.metric1.value}</div>
                        <div className="text-xs text-muted-foreground">{project.impact.metric1.label}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold gradient-text">{project.impact.metric2.value}</div>
                        <div className="text-xs text-muted-foreground">{project.impact.metric2.label}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold gradient-text">{project.impact.metric3.value}</div>
                        <div className="text-xs text-muted-foreground">{project.impact.metric3.label}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let's discuss how we can transform your ideas into powerful digital solutions that drive real results.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[var(--vespa-purple)] to-[var(--vespa-blue)] text-white hover:opacity-90 group"
            onClick={handleStartProject}
          >
            Start Your Project
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
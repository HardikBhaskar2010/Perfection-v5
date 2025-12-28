import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Cpu, BookOpen, ArrowRight, Sparkles, Rocket, Brain, LogOut, TrendingUp, Plus, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import { useTutorial } from '@/contexts/TutorialContext';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { projectService, type SavedProject } from '@/services/projectService';
import { toast } from '@/hooks/use-toast';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, mode, isLoading: authLoading, isGuest } = useAuth();
  const { tutorialState, startWelcomeTour } = useTutorial();

  // Dashboard state
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, planning: 0 });

  // Animation refs for hero section (Landing view)
  const heroIconRef = useScrollAnimation<HTMLDivElement>({ animation: 'fadeIn', delay: 0 });
  const heroTitleRef = useScrollAnimation<HTMLHeadingElement>({ animation: 'fadeIn', delay: 200 });
  const heroDescRef = useScrollAnimation<HTMLParagraphElement>({ animation: 'fadeIn', delay: 400 });
  const heroButtonsRef = useScrollAnimation<HTMLDivElement>({ animation: 'fadeIn', delay: 600 });

  // Determine which view to show
  const showDashboard = mode === 'authenticated';
  const showLanding = mode === 'unauthenticated' || mode === 'guest';

  // Load projects for dashboard view
  useEffect(() => {
    if (showDashboard) {
      loadProjects();
    }
  }, [showDashboard]);

  // Start welcome tour on first visit (Landing view only)
  useEffect(() => {
    if (showLanding && !tutorialState.hasSeenWelcome) {
      const timer = setTimeout(() => {
        startWelcomeTour();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showLanding, tutorialState.hasSeenWelcome, startWelcomeTour]);

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    const userProjects = await projectService.getProjects();
    setProjects(userProjects);

    const projectStats = await projectService.getProjectStats();
    if (projectStats) {
      setStats(projectStats);
    }
    setIsLoadingProjects(false);
  };

  const handleLogout = async () => {
    const { error } = await authService.signOut();
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
      return;
    }
    // Stay on home page after logout
  };

  const handleDeleteProject = async (id: string) => {
    const success = await projectService.deleteProject(id);
    if (success) {
      toast({
        title: 'Project deleted',
        description: 'The project has been removed',
      });
      await loadProjects();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return project.status === 'completed';
    if (activeTab === 'in-progress') return project.status === 'in-progress';
    if (activeTab === 'planning') return project.status === 'planning';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-500';
      case 'planning':
        return 'bg-orange-500/10 text-orange-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Ideas',
      description: 'Generate innovative STEM project ideas tailored to your skill level',
      color: 'bg-gradient-primary',
      link: '/generator'
    },
    {
      icon: Cpu,
      title: 'Component Database',
      description: 'Browse 500+ electronic components with detailed specifications',
      color: 'bg-gradient-secondary',
      link: '/components'
    },
    {
      icon: BookOpen,
      title: 'Project Library',
      description: 'Save, organize, and track your projects in one place',
      color: 'bg-gradient-accent',
      link: '/library'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div ref={heroIconRef.ref} className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow animate-glow-pulse">
                <Rocket className="w-16 h-16 text-white" />
              </div>
            </div>

            <h1 ref={heroTitleRef.ref} className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">STEM Project</span>
              <br />
              <span className="text-foreground">Generator</span>
            </h1>

            <p ref={heroDescRef.ref} className="text-xl md:text-2xl text-muted-foreground mb-8">
              Transform your ideas into reality with AI-powered project suggestions
              and a comprehensive component database
            </p>

            <div ref={heroButtonsRef.ref} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/generator">
                <Button
                  size="lg"
                  className="bg-gradient-primary text-white shadow-glow"
                  ripple={true}
                >
                  <Sparkles className="mr-2 w-5 h-5" />
                  Start Generating
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/components">
                <Button size="lg" variant="outline">
                  Browse Components
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gradient-secondary">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful tools to bring your electronics projects to life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link to={feature.link} className="block">
                  <Card
                    key={index}
                    className="group border-border/50 glass-effect cursor-pointer"
                    enableAnimation={true}
                    enableHover={true}
                    animationDelay={index * 100}
                  >
                  <CardHeader>
                    <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:animate-glow-pulse`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="group/btn w-full">
                      Explore
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <Card
            className="max-w-4xl mx-auto glass-effect border-primary/20 shadow-glow"
            enableAnimation={true}
          >
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of makers and innovators creating the future
              </p>
              <Link to="/generator">
                <Button
                  size="lg"
                  className="bg-gradient-primary text-white shadow-glow"
                  ripple={true}
                >
                  <Zap className="mr-2 w-5 h-5" />
                  Get Started Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
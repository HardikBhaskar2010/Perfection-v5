import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, BookOpen, Cpu, TrendingUp, Plus, Eye, Trash2, BarChart3, CheckCircle, Clock, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { projectService, type SavedProject } from '@/services/projectService';
import { toast } from '@/hooks/use-toast';
import { ProjectStatsCard } from '@/components/dashboard/ProjectStatsCard';
import { ProjectStatusChart } from '@/components/dashboard/ProjectStatusChart';
import { ProjectDifficultyChart } from '@/components/dashboard/ProjectDifficultyChart';
import { ProjectProgressChart } from '@/components/dashboard/ProjectProgressChart';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, planning: 0 });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    const userProjects = await projectService.getProjects();
    setProjects(userProjects);

    const projectStats = await projectService.getProjectStats();
    if (projectStats) {
      setStats(projectStats);
    }
    setIsLoading(false);
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
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'in-progress':
        return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
      case 'planning':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin-slow">
              <Zap className="w-12 h-12 text-primary" />
            </div>
            <p className="text-muted-foreground animate-pulse">Initializing your workspace...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 via-background to-background pt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient">
                  Workspace
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg">
                  Welcome back! Here's an overview of your STEM innovation projects.
                </p>
              </div>
              <Button
                size="lg"
                className="bg-gradient-primary text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 rounded-full px-8 h-14"
                onClick={() => navigate('/generator')}
              >
                <Plus className="w-5 h-5 mr-2" />
                <span className="font-semibold">New Project</span>
              </Button>
            </div>

            {/* Stats Cards Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <ProjectStatsCard
                title="Total Projects"
                value={stats.total}
                icon={BarChart3}
                colorClass="text-primary"
                delay={0}
              />
              <ProjectStatsCard
                title="Completed"
                value={stats.completed}
                icon={CheckCircle}
                colorClass="text-emerald-500"
                delay={100}
              />
              <ProjectStatsCard
                title="In Progress"
                value={stats.inProgress}
                icon={Clock}
                colorClass="text-sky-500"
                delay={200}
              />
              <ProjectStatsCard
                title="Planning"
                value={stats.planning}
                icon={Lightbulb}
                colorClass="text-amber-500"
                delay={300}
              />
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Analytics */}
              <div className="lg:col-span-1 space-y-8">
                <Card className="glass-effect border-primary/10 overflow-hidden shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Activity Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ProjectStatusChart 
                      stats={{ 
                        completed: stats.completed, 
                        inProgress: stats.inProgress, 
                        planning: stats.planning 
                      }} 
                    />
                  </CardContent>
                </Card>
                
                <Card className="glass-effect border-primary/10 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Project Complexity</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ProjectDifficultyChart projects={projects} />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Projects List */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <TabsList className="bg-muted/50 p-1 rounded-xl">
                        <TabsTrigger value="all" className="rounded-lg px-4">All</TabsTrigger>
                        <TabsTrigger value="planning" className="rounded-lg px-4">Planning</TabsTrigger>
                        <TabsTrigger value="in-progress" className="rounded-lg px-4">Active</TabsTrigger>
                        <TabsTrigger value="completed" className="rounded-lg px-4">Done</TabsTrigger>
                      </TabsList>
                    </div>
                  </Tabs>
                </div>

                <div className="space-y-4">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, index) => (
                      <Card
                        key={project.id}
                        className="group relative overflow-hidden glass-effect border-primary/5 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md"
                        enableAnimation={true}
                        enableHover={true}
                        animationDelay={index * 50}
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className={`${getStatusColor(project.status)} border px-2 py-0 font-medium capitalize`}>
                                  {project.status.replace('-', ' ')}
                                </Badge>
                                <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground text-xs uppercase tracking-wider">
                                  {project.difficulty}
                                </Badge>
                              </div>
                              
                              <div>
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-1">{project.title}</h3>
                                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                                  {project.description}
                                </p>
                              </div>

                              <div className="pt-2">
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Progress</span>
                                  <span className="text-xs font-bold">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-primary transition-all duration-700 ease-out"
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-6 pt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{project.estimated_time}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Zap className="w-3.5 h-3.5" />
                                  <span>{project.estimated_cost}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-xl bg-primary/5 hover:bg-primary text-primary hover:text-white transition-all duration-300"
                                onClick={() => navigate(`/project/${project.id}`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDeleteProject(project.id)}
                                className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="glass-effect border-dashed border-primary/20 py-20">
                      <CardContent className="text-center space-y-4">
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-2">
                          <BookOpen className="w-10 h-10 text-primary/40" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold">No projects found</h3>
                          <p className="text-muted-foreground">Start by generating your first STEM project idea.</p>
                        </div>
                        <Button
                          size="lg"
                          className="bg-gradient-primary text-white rounded-full px-8 mt-4"
                          onClick={() => navigate('/generator')}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Get Started
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

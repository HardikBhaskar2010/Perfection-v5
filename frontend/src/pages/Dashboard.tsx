import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Zap, BookOpen, Cpu, TrendingUp, Plus, Eye, Trash2, BarChart3, CheckCircle, Clock, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { projectService, type SavedProject } from '@/services/projectService';
import { toast } from '@/hooks/use-toast';
import { ProjectStatsCard } from '@/components/dashboard/ProjectStatsCard';
import { ProjectStatusChart } from '@/components/dashboard/ProjectStatusChart';
import { ProjectDifficultyChart } from '@/components/dashboard/ProjectDifficultyChart';
import { ProjectProgressChart } from '@/components/dashboard/ProjectProgressChart';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, mode, isGuest } = useAuth();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, planning: 0 });

  // STEP 3: Allow both guest and authenticated users
  useEffect(() => {
    // Only redirect if truly unauthenticated (not guest)
    if (!authLoading && mode === 'unauthenticated') {
      navigate('/login');
      return;
    }

    // Load projects for both guests and authenticated users
    if (mode === 'guest' || mode === 'authenticated') {
      loadProjects();
    }
  }, [authLoading, mode, navigate]);

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
    navigate('/');
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

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin">
            <Zap className="w-8 h-8 text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="My Dashboard"
        description="View and manage your STEM projects"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow animate-glow-pulse">
            <TrendingUp className="w-12 h-12 text-white" />
          </div>
        </div>
      </PageHeader>

      <div className="container mx-auto px-4 py-8">
        {/* Header with logout */}
        <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
          <div>
            {isGuest ? (
              <div>
                <p className="text-muted-foreground">Welcome, Guest!</p>
                <p className="text-xs text-muted-foreground">
                  Create an account to save your progress permanently
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Welcome, {user?.email}</p>
            )}
          </div>
          <div className="flex gap-2">
            {isGuest && (
              <Button
                variant="default"
                onClick={() => navigate('/signup')}
                className="bg-gradient-primary text-white"
              >
                Create Account
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              {isGuest ? 'Exit Guest Mode' : 'Sign Out'}
            </Button>
          </div>
        </div>

        {/* Stats Cards with Animation */}
        <div className="grid md:grid-cols-4 gap-4 max-w-6xl mx-auto mb-8">
          <ProjectStatsCard
            title="Total Projects"
            value={stats.total}
            icon={BarChart3}
            colorClass="text-gradient"
            delay={0}
          />
          <ProjectStatsCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            colorClass="text-green-500"
            delay={100}
          />
          <ProjectStatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
            colorClass="text-blue-500"
            delay={200}
          />
          <ProjectStatsCard
            title="Planning"
            value={stats.planning}
            icon={Lightbulb}
            colorClass="text-orange-500"
            delay={300}
          />
        </div>

        {/* Graphs Section */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
          <ProjectStatusChart 
            stats={{ 
              completed: stats.completed, 
              inProgress: stats.inProgress, 
              planning: stats.planning 
            }} 
          />
          <ProjectDifficultyChart projects={projects} />
          <div className="md:col-span-2">
            <ProjectProgressChart projects={projects} />
          </div>
        </div>

        {/* Projects Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <Button
              className="bg-gradient-primary text-white"
              onClick={() => navigate('/generator')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate New Project
            </Button>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="glass-effect">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="planning">Planning</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="group glass-effect border-border/50"
                  enableAnimation={true}
                  enableHover={true}
                  animationDelay={index * 50}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Status and Difficulty */}
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <Badge variant="outline">{project.difficulty}</Badge>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Estimated Time</p>
                        <p className="font-medium">{project.estimated_time}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">{project.estimated_cost}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-effect border-border/50">
              <CardContent className="py-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No projects yet</p>
                <Button
                  className="bg-gradient-primary text-white"
                  onClick={() => navigate('/generator')}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Your First Project
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

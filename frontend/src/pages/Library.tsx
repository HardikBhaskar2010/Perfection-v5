import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Clock, Star, Trash2, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Define project type
interface Project {
  id: number | string;
  title: string;
  description: string;
  status: string;
  progress: number;
  lastUpdated: string;
  difficulty: string;
  starred: boolean;
  tags: string[];
}

const Library: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load projects - without Supabase, we'll use localStorage for demo
  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = () => {
    setIsLoading(true);
    try {
      // Try to load from localStorage
      const savedProjects = localStorage.getItem('user_projects');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      } else {
        // Initialize with empty array (no fake data)
        setProjects([]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-500';
      case 'In Progress': return 'bg-blue-500/10 text-blue-500';
      case 'Planning': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-gradient-primary';
      case 'Intermediate': return 'bg-gradient-secondary';
      case 'Advanced': return 'bg-gradient-accent';
      default: return 'bg-gradient-primary';
    }
  };

  const handleDeleteProject = (id: number | string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
    toast({
      title: "Project Deleted",
      description: "The project has been removed from your library.",
    });
  };

  const handleToggleStar = (id: number | string) => {
    const updatedProjects = projects.map(p => 
      p.id === id ? { ...p, starred: !p.starred } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') {
      return true;
    }
    if (activeTab === 'starred') {
      return project.starred;
    }
    return project.status.toLowerCase().replace(' ', '-') === activeTab;
  });

  return (
    <Layout>
      <PageHeader 
        title="Project Library"
        description="Manage and track all your STEM projects in one place"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-accent rounded-2xl shadow-glow animate-glow-pulse">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
        </div>
      </PageHeader>
      
      <div className="container mx-auto px-4 py-8">

        {/* Actions Bar */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="glass-effect">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button 
              className="bg-gradient-primary text-white shadow-glow"
              ripple={true}
              onClick={() => navigate('/generator')}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {filteredProjects.map((project, index) => (
            <Card 
              key={project.id}
              className="group glass-effect border-border/50"
              enableAnimation={true}
              enableHover={true}
              animationDelay={index * 50}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {project.description}
                    </CardDescription>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleToggleStar(project.id)}
                    className={project.starred ? 'text-yellow-500' : 'text-muted-foreground'}
                  >
                    <Star className={`w-4 h-4 ${project.starred ? 'fill-yellow-500' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Status and Difficulty */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge variant="outline" className="border-primary/50">
                    {project.difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground ml-auto flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {project.lastUpdated}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full ${getDifficultyColor(project.difficulty)} transition-all duration-500`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      toast({
                        title: "Edit Project",
                        description: "Project editing coming soon!",
                      });
                    }}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">No projects found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start by generating a new project or creating one manually
            </p>
            <Button 
              className="mt-4 bg-gradient-primary text-white shadow-glow"
              ripple={true}
              onClick={() => navigate('/generator')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Library;
import React, { useState, useEffect } from 'react';
import { Zap, Loader2, RefreshCw, Save, Lightbulb, Target, Users, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { HelpTooltip } from '@/components/ui/enhanced-tooltip';
import { toast } from '@/hooks/use-toast';
import { generateProject, healthCheck, type ProjectParams } from '@/services/apiService';
import { projectService } from '@/services/projectService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageTutorial from '@/components/tutorial/PageTutorial';
import { generatorTutorialSteps } from '@/config/tutorialSteps';

const Generator: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [generatedProject, setGeneratedProject] = useState<{
    title: string;
    description: string;
    difficulty: string;
    estimatedTime: string;
    estimatedCost: string;
    components: string[];
    skills: string[];
    steps: string[];
  } | null>(null);
  const [formData, setFormData] = useState<ProjectParams>({
    projectType: '',
    skillLevel: '',
    interests: '',
    budget: '',
    duration: ''
  });

  // Animation refs
  const formCardRef = useScrollAnimation<HTMLDivElement>({ animation: 'fadeIn', delay: 100 });
  const resultCardRef = useScrollAnimation<HTMLDivElement>({ animation: 'fadeIn', delay: 200 });

  // Check backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await healthCheck();
        setBackendStatus('connected');
        console.log('✅ Backend connected successfully');
      } catch (error) {
        setBackendStatus('disconnected');
        console.error('❌ Backend connection failed:', error);
      }
    };
    checkBackend();
  }, []);

  const handleGenerate = async () => {
    // Validate form
    if (!formData.projectType || !formData.skillLevel) {
      toast({
        title: "Missing Information",
        description: "Please select both project type and skill level.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Call the API service to generate project
      const project = await generateProject(formData);
      
      setGeneratedProject(project);
      toast({
        title: "Project Generated!",
        description: "Your personalized STEM project is ready.",
      });
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unable to generate project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProject = async () => {
    if (!generatedProject) {
      toast({
        title: "Error",
        description: "No project to save",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Save to localStorage instead of Supabase
      const existingProjects = localStorage.getItem('user_projects');
      const projects = existingProjects ? JSON.parse(existingProjects) : [];
      
      const newProject = {
        id: Date.now(), // Use timestamp as ID
        title: generatedProject.title,
        description: generatedProject.description,
        status: 'Planning',
        progress: 0,
        lastUpdated: 'Just now',
        difficulty: generatedProject.difficulty,
        starred: false,
        tags: [formData.projectType, generatedProject.difficulty],
        estimatedTime: generatedProject.estimatedTime,
        estimatedCost: generatedProject.estimatedCost,
        components: generatedProject.components,
        skills: generatedProject.skills,
        steps: generatedProject.steps,
        project_type: formData.projectType,
        generated_from_params: formData,
        created_at: new Date().toISOString(),
      };

      projects.unshift(newProject); // Add to beginning
      localStorage.setItem('user_projects', JSON.stringify(projects));

      toast({
        title: "Project Saved!",
        description: "Your project has been added to your library.",
      });
      
      // Navigate to library to see the saved project
      navigate('/library');
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <PageTutorial pageName="generator" steps={generatorTutorialSteps} />
      <PageHeader 
        title="AI Project Generator"
        description={
          <div className="flex items-center gap-2">
            <span>Get personalized STEM project ideas based on your interests and skill level</span>
            {backendStatus === 'connected' && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Backend Connected
              </Badge>
            )}
            {backendStatus === 'disconnected' && (
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                <XCircle className="w-3 h-3 mr-1" />
                Backend Offline
              </Badge>
            )}
          </div>
        }
      >
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow animate-glow-pulse">
            <Lightbulb className="w-12 h-12 text-white" />
          </div>
        </div>
      </PageHeader>
      
      <div className="container mx-auto px-4 py-8">

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Form */}
          <Card 
            ref={formCardRef.ref}
            className="glass-effect border-border/50"
            enableAnimation={false}
            data-tutorial="project-form"
          >
            <CardHeader>
              <CardTitle className="text-2xl">Project Parameters</CardTitle>
              <CardDescription>
                Tell us about your preferences and we'll generate the perfect project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="projectType">Project Type</Label>
                  <HelpTooltip content="Choose the type of project you want to build. This helps our AI suggest relevant components and difficulty levels." />
                </div>
                <Select 
                  value={formData.projectType} 
                  onValueChange={(value) => setFormData({...formData, projectType: value})}
                >
                  <SelectTrigger id="projectType">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="robotics">Robotics</SelectItem>
                    <SelectItem value="iot">IoT & Smart Devices</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="automation">Home Automation</SelectItem>
                    <SelectItem value="sensors">Sensors & Monitoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="skillLevel">Skill Level</Label>
                  <HelpTooltip content="Be honest about your current skill level. This ensures the project complexity matches your abilities and learning goals." />
                </div>
                <Select 
                  value={formData.skillLevel} 
                  onValueChange={(value) => setFormData({...formData, skillLevel: value})}
                >
                  <SelectTrigger id="skillLevel">
                    <SelectValue placeholder="Select your skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="interests">Interests & Goals</Label>
                  <HelpTooltip content="Describe what you want to learn or build. Be specific about your goals - this helps generate more personalized project suggestions." />
                </div>
                <Textarea
                  id="interests"
                  placeholder="e.g., Learn Arduino, build something for my room, environmental monitoring..."
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input
                    id="budget"
                    placeholder="e.g., $50-100"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className=""
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Time Available</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 2 weeks"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className=""
                  />
                </div>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-primary text-white shadow-glow"
                ripple={true}
                size="lg"
                data-tutorial="generate-button"
                data-testid="generate-project-btn"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Project...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Generate Project
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Project */}
          <div ref={resultCardRef.ref} className="space-y-6">
            {generatedProject ? (
              <Card 
                className="glass-effect border-primary/20 shadow-glow"
                enableAnimation={true}
                enableHover={false}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-gradient">
                        {generatedProject.title}
                      </CardTitle>
                      <CardDescription className="mt-2 text-base">
                        {generatedProject.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Project Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <Target className="w-6 h-6 mx-auto mb-1 text-primary" />
                      <p className="text-sm font-medium">{generatedProject.difficulty}</p>
                      <p className="text-xs text-muted-foreground">Difficulty</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <Users className="w-6 h-6 mx-auto mb-1 text-secondary" />
                      <p className="text-sm font-medium">{generatedProject.estimatedTime}</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <Zap className="w-6 h-6 mx-auto mb-1 text-accent" />
                      <p className="text-sm font-medium">{generatedProject.estimatedCost}</p>
                      <p className="text-xs text-muted-foreground">Budget</p>
                    </div>
                  </div>

                  {/* Components */}
                  <div>
                    <h4 className="font-semibold mb-2">Required Components</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedProject.components.map((component: string, index: number) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gradient-primary/10 text-primary rounded-full text-sm"
                        >
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-semibold mb-2">Skills You'll Learn</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedProject.skills.map((skill: string, index: number) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div>
                    <h4 className="font-semibold mb-2">Project Steps</h4>
                    <ol className="space-y-2">
                      {generatedProject.steps.map((step: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-gradient-primary text-white rounded-full flex items-center justify-center text-xs mr-3">
                            {index + 1}
                          </span>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveProject}
                      disabled={isSaving}
                      className="flex-1 bg-gradient-primary text-white"
                      ripple={true}
                      data-tutorial="save-button"
                      data-testid="save-project-btn"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save to Library
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      variant="outline"
                      className="flex-1"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card 
                className="glass-effect border-border/50 h-full flex items-center justify-center min-h-[400px]"
                enableAnimation={true}
              >
                <CardContent className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-xl text-muted-foreground">
                    Your generated project will appear here
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Fill in the form and click generate to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Generator;
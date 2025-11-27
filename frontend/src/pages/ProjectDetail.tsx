import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Star, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import { projectService, type SavedProject } from '@/services/projectService';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [project, setProject] = useState<SavedProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<SavedProject> | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (id) {
      loadProject();
    }
  }, [authLoading, user, id, navigate]);

  const loadProject = async () => {
    if (!id) return;
    setIsLoading(true);
    const loadedProject = await projectService.getProjectById(id);
    if (loadedProject) {
      setProject(loadedProject);
      setEditData(loadedProject);
    } else {
      toast({
        title: 'Error',
        description: 'Project not found',
        variant: 'destructive',
      });
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  const handleSaveChanges = async () => {
    if (!project || !editData) return;
    setIsSaving(true);

    const success = await projectService.updateProject(project.id, {
      title: editData.title,
      description: editData.description,
      status: editData.status,
      progress: editData.progress,
      notes: editData.notes,
      tags: editData.tags,
      estimated_time: editData.estimated_time,
      estimated_cost: editData.estimated_cost,
    });

    if (success) {
      setProject(success);
      setIsEditing(false);
      toast({
        title: 'Project updated',
        description: 'Your changes have been saved',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update project',
        variant: 'destructive',
      });
    }
    setIsSaving(false);
  };

  const handleToggleStar = async () => {
    if (!project) return;
    const updated = await projectService.toggleStarProject(project.id, !project.starred);
    if (updated) {
      setProject(updated);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    const confirmed = window.confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;

    const success = await projectService.deleteProject(project.id);
    if (success) {
      toast({
        title: 'Project deleted',
        description: 'The project has been removed',
      });
      navigate('/dashboard');
    }
  };

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
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!project || !editData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="glass-effect w-96">
            <CardContent className="pt-6">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-center text-muted-foreground mb-4">Project not found</p>
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title={isEditing ? 'Edit Project' : 'Project Details'}
        description={isEditing ? 'Update your project information' : project.title}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </PageHeader>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Card */}
          {!isEditing ? (
            <Card className="glass-effect border-border/50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{project.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleStar}
                        className="gap-1"
                      >
                        <Star
                          className={`w-4 h-4 ${project.starred ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
                        />
                      </Button>
                    </div>
                    <CardDescription className="text-base">
                      {project.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className="text-destructive hover:bg-destructive/10 gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge variant="outline">{project.difficulty}</Badge>
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Time</p>
                    <p className="font-semibold">{project.estimated_time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Budget</p>
                    <p className="font-semibold">{project.estimated_cost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Type</p>
                    <p className="font-semibold capitalize">{project.project_type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Edit Form */
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle>Edit Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editData.title || ''}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editData.description || ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editData.status || ''}
                      onValueChange={(value) => setEditData({ ...editData, status: value as any })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="abandoned">Abandoned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="progress">Progress: {editData.progress}%</Label>
                    <input
                      id="progress"
                      type="range"
                      min="0"
                      max="100"
                      value={editData.progress || 0}
                      onChange={(e) => setEditData({ ...editData, progress: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time">Estimated Time</Label>
                    <Input
                      id="time"
                      value={editData.estimated_time || ''}
                      onChange={(e) => setEditData({ ...editData, estimated_time: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost">Estimated Cost</Label>
                    <Input
                      id="cost"
                      value={editData.estimated_cost || ''}
                      onChange={(e) => setEditData({ ...editData, estimated_cost: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editData.notes || ''}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    rows={4}
                    placeholder="Add notes about your project progress..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="flex-1 bg-gradient-primary text-white"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setEditData(project);
                      setIsEditing(false);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Components Section */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Required Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.components.map((component: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-base py-1.5">
                    {component}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Skills to Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill: string, index: number) => (
                  <Badge key={index} className="bg-gradient-primary/20 text-primary border border-primary/30">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Steps Section */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Project Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {project.steps.map((step: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-gradient-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Notes Section */}
          {project.notes && (
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{project.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;

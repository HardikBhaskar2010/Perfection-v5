import { supabase } from '@/lib/supabase';
import type { GeneratedProject } from './apiService';

export interface SavedProject extends GeneratedProject {
  id: string;
  user_id: string;
  status: 'planning' | 'in-progress' | 'completed' | 'abandoned';
  progress: number;
  notes: string;
  starred: boolean;
  tags: string[];
  generated_from_params: {
    projectType: string;
    skillLevel: string;
    interests: string;
    budget: string;
    duration: string;
  };
  created_at: string;
  updated_at: string;
}

interface CreateProjectData {
  title: string;
  description: string;
  project_type: string;
  difficulty: string;
  estimated_time: string;
  estimated_cost: string;
  components: string[];
  skills: string[];
  steps: string[];
  generated_from_params?: Record<string, string>;
}

interface UpdateProjectData {
  title?: string;
  description?: string;
  status?: string;
  progress?: number;
  notes?: string;
  starred?: boolean;
  tags?: string[];
  estimated_time?: string;
  estimated_cost?: string;
  components?: string[];
  skills?: string[];
  steps?: string[];
}

class ProjectService {
  async saveProject(projectData: CreateProjectData): Promise<SavedProject | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User must be authenticated to save projects');
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: projectData.title,
          description: projectData.description,
          project_type: projectData.project_type,
          difficulty: projectData.difficulty,
          estimated_time: projectData.estimated_time,
          estimated_cost: projectData.estimated_cost,
          components: projectData.components,
          skills: projectData.skills,
          steps: projectData.steps,
          tags: [],
          generated_from_params: projectData.generated_from_params || {},
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error saving project:', error);
        throw error;
      }

      return data as SavedProject;
    } catch (error) {
      console.error('Save project error:', error);
      return null;
    }
  }

  async getProjects(filters?: {
    status?: string;
    projectType?: string;
  }): Promise<SavedProject[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return [];
      }

      let query = supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.projectType) {
        query = query.eq('project_type', filters.projectType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching projects:', error);
        return [];
      }

      return (data || []) as SavedProject[];
    } catch (error) {
      console.error('Get projects error:', error);
      return [];
    }
  }

  async getProjectById(id: string): Promise<SavedProject | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching project:', error);
        return null;
      }

      return data as SavedProject;
    } catch (error) {
      console.error('Get project error:', error);
      return null;
    }
  }

  async updateProject(id: string, updates: UpdateProjectData): Promise<SavedProject | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User must be authenticated to update projects');
      }

      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }

      return data as SavedProject;
    } catch (error) {
      console.error('Update project error:', error);
      return null;
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User must be authenticated to delete projects');
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Delete project error:', error);
      return false;
    }
  }

  async toggleStarProject(id: string, starred: boolean): Promise<SavedProject | null> {
    return this.updateProject(id, { starred });
  }

  async updateProjectProgress(id: string, progress: number): Promise<SavedProject | null> {
    return this.updateProject(id, { progress: Math.min(100, Math.max(0, progress)) });
  }

  async getProjectStats(): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    planning: number;
  } | null> {
    try {
      const projects = await this.getProjects();

      return {
        total: projects.length,
        completed: projects.filter(p => p.status === 'completed').length,
        inProgress: projects.filter(p => p.status === 'in-progress').length,
        planning: projects.filter(p => p.status === 'planning').length,
      };
    } catch (error) {
      console.error('Get project stats error:', error);
      return null;
    }
  }
}

export const projectService = new ProjectService();

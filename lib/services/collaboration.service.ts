import { db } from '@/lib/db/supabase';

export interface Collaborator {
  id: string;
  userId: string;
  projectId: string;
  role: 'admin' | 'editor' | 'viewer';
  email: string;
  joinedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  projectId: string;
  content: string;
  createdAt: Date;
  resolved: boolean;
}

export const CollaborationService = {
  async addCollaborator(userId: string, projectId: string, email: string, role: Collaborator['role'] = 'editor'): Promise<Collaborator> {
    const collaborator: Collaborator = {
      id: Math.random().toString(36).substring(7),
      userId,
      projectId,
      role,
      email,
      joinedAt: new Date()
    };

    await db.from('collaborators').insert(collaborator);
    return collaborator;
  },

  async removeCollaborator(collaboratorId: string): Promise<void> {
    await db.from('collaborators').delete().eq('id', collaboratorId);
  },

  async getProjectCollaborators(projectId: string): Promise<Collaborator[]> {
    const { data } = await db.from('collaborators').select('*').eq('project_id', projectId);
    return data || [];
  },

  async addComment(userId: string, projectId: string, content: string): Promise<Comment> {
    const comment: Comment = {
      id: Math.random().toString(36).substring(7),
      userId,
      projectId,
      content,
      createdAt: new Date(),
      resolved: false
    };

    await db.from('comments').insert(comment);
    return comment;
  },

  async resolveComment(commentId: string): Promise<void> {
    await db.from('comments').update({ resolved: true }).eq('id', commentId);
  },

  async getProjectComments(projectId: string): Promise<Comment[]> {
    const { data } = await db.from('comments').select('*').eq('project_id', projectId).order('created_at', { ascending: false });
    return data || [];
  }
};

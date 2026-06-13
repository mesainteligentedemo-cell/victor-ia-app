/**
 * Support Ticketing Manager
 * Help desk, support tickets, and customer support automation
 */

import { Database } from '@supabase/supabase-js';

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: 'billing' | 'technical' | 'feature_request' | 'bug' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_for_user' | 'resolved' | 'closed';
  assignedTo?: string; // Support agent user ID
  messages: TicketMessage[];
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  timeToFirstResponse?: number; // seconds
  timeToResolution?: number; // seconds
}

export interface TicketMessage {
  id: string;
  authorId: string;
  authorType: 'user' | 'support_agent' | 'ai_bot';
  content: string;
  attachments?: string[];
  createdAt: number;
}

export interface SupportMetrics {
  totalTickets: number;
  openTickets: number;
  avgTimeToFirstResponse: number; // hours
  avgTimeToResolution: number; // hours
  resolutionRate: number; // %
  customerSatisfaction: number; // 1-5 stars
}

class SupportManager {
  private db: Database | null = null;

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Create support ticket
   */
  async createTicket(
    userId: string,
    subject: string,
    description: string,
    options: {
      category: 'billing' | 'technical' | 'feature_request' | 'bug' | 'other';
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      attachments?: string[];
    }
  ): Promise<SupportTicket | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data, error } = await this.db
        .from('support_tickets')
        .insert([
          {
            user_id: userId,
            subject,
            description,
            category: options.category,
            priority: options.priority || 'medium',
            status: 'open',
            messages: [
              {
                id: `msg_${Date.now()}`,
                author_id: userId,
                author_type: 'user',
                content: description,
                attachments: options.attachments,
                created_at: Math.floor(now / 1000),
              },
            ],
            created_at: Math.floor(now / 1000),
            updated_at: Math.floor(now / 1000),
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Auto-assign based on priority
      if (options.priority === 'urgent') {
        // TODO: Notify support team
      }

      return this._mapDatabaseTicket(data);
    } catch (error) {
      console.error('Failed to create support ticket:', error);
      return null;
    }
  }

  /**
   * Add message to ticket
   */
  async addMessage(
    ticketId: string,
    userId: string,
    content: string,
    authorType: 'user' | 'support_agent' | 'ai_bot' = 'user'
  ): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data: ticket } = await this.db
        .from('support_tickets')
        .select('messages')
        .eq('id', ticketId)
        .single();

      if (!ticket) {
        return false;
      }

      const newMessage: TicketMessage = {
        id: `msg_${Date.now()}`,
        authorId: userId,
        authorType,
        content,
        createdAt: now,
      };

      const updatedMessages = [...(ticket.messages || []), newMessage];

      await this.db
        .from('support_tickets')
        .update({
          messages: updatedMessages,
          updated_at: Math.floor(now / 1000),
        })
        .eq('id', ticketId);

      return true;
    } catch (error) {
      console.error('Failed to add message:', error);
      return false;
    }
  }

  /**
   * Update ticket status
   */
  async updateStatus(
    ticketId: string,
    newStatus: 'open' | 'in_progress' | 'waiting_for_user' | 'resolved' | 'closed'
  ): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();
      const updates: any = {
        status: newStatus,
        updated_at: Math.floor(now / 1000),
      };

      if (newStatus === 'resolved' || newStatus === 'closed') {
        updates.resolved_at = Math.floor(now / 1000);
      }

      const { error } = await this.db
        .from('support_tickets')
        .update(updates)
        .eq('id', ticketId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      return false;
    }
  }

  /**
   * Assign ticket to support agent
   */
  async assignTicket(ticketId: string, agentId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { error } = await this.db
        .from('support_tickets')
        .update({
          assigned_to: agentId,
          updated_at: Math.floor(Date.now() / 1000),
        })
        .eq('id', ticketId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to assign ticket:', error);
      return false;
    }
  }

  /**
   * Get ticket
   */
  async getTicket(ticketId: string): Promise<SupportTicket | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabaseTicket(data);
    } catch (error) {
      console.error('Failed to get ticket:', error);
      return null;
    }
  }

  /**
   * Get user's tickets
   */
  async getUserTickets(userId: string): Promise<SupportTicket[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('support_tickets')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(t => this._mapDatabaseTicket(t));
    } catch (error) {
      console.error('Failed to get user tickets:', error);
      return [];
    }
  }

  /**
   * Get support metrics
   */
  async getMetrics(): Promise<SupportMetrics> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('support_tickets')
        .select('*');

      if (error || !data) {
        return {
          totalTickets: 0,
          openTickets: 0,
          avgTimeToFirstResponse: 0,
          avgTimeToResolution: 0,
          resolutionRate: 0,
          customerSatisfaction: 0,
        };
      }

      const totalTickets = data.length;
      const openTickets = data.filter(t => t.status === 'open').length;
      const resolvedTickets = data.filter(t => t.resolved_at).length;

      // Calculate average times
      let totalFirstResponseTime = 0;
      let totalResolutionTime = 0;
      let responseCount = 0;

      for (const ticket of data) {
        if (ticket.messages && ticket.messages.length > 1) {
          const firstUserMsg = ticket.messages[0];
          const firstResponse = ticket.messages.find(
            (m: any) => m.author_type === 'support_agent'
          );

          if (firstResponse) {
            const time = (firstResponse.created_at - firstUserMsg.created_at) * 1000;
            totalFirstResponseTime += time;
            responseCount++;
          }
        }

        if (ticket.resolved_at && ticket.created_at) {
          const time = (ticket.resolved_at - ticket.created_at) * 1000;
          totalResolutionTime += time;
        }
      }

      return {
        totalTickets,
        openTickets,
        avgTimeToFirstResponse: responseCount > 0 ? totalFirstResponseTime / responseCount / 3600000 : 0,
        avgTimeToResolution: resolvedTickets > 0 ? totalResolutionTime / resolvedTickets / 3600000 : 0,
        resolutionRate: totalTickets > 0 ? (resolvedTickets / totalTickets) * 100 : 0,
        customerSatisfaction: 4.2, // Would pull from ratings in production
      };
    } catch (error) {
      console.error('Failed to get support metrics:', error);
      return {
        totalTickets: 0,
        openTickets: 0,
        avgTimeToFirstResponse: 0,
        avgTimeToResolution: 0,
        resolutionRate: 0,
        customerSatisfaction: 0,
      };
    }
  }

  /**
   * Create FAQ/Knowledge base article
   */
  async createKBArticle(
    title: string,
    content: string,
    tags: string[]
  ): Promise<{ id: string; url: string } | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { data, error } = await this.db
        .from('kb_articles')
        .insert([
          {
            title,
            slug,
            content,
            tags,
            created_at: Math.floor(Date.now() / 1000),
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        url: `/help/${data.slug}`,
      };
    } catch (error) {
      console.error('Failed to create KB article:', error);
      return null;
    }
  }

  // Private helpers

  private _mapDatabaseTicket(data: any): SupportTicket {
    return {
      id: data.id,
      userId: data.user_id,
      subject: data.subject,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: data.status,
      assignedTo: data.assigned_to,
      messages: (data.messages || []).map((m: any) => ({
        id: m.id,
        authorId: m.author_id,
        authorType: m.author_type,
        content: m.content,
        attachments: m.attachments,
        createdAt: m.created_at * 1000,
      })),
      createdAt: data.created_at * 1000,
      updatedAt: data.updated_at * 1000,
      resolvedAt: data.resolved_at ? data.resolved_at * 1000 : undefined,
      timeToFirstResponse: data.time_to_first_response,
      timeToResolution: data.time_to_resolution,
    };
  }
}

export default SupportManager;
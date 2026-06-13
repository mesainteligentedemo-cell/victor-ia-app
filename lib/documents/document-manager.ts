/**
 * Document Management System
 * Folders, templates, search, and organization
 */

export type DocumentStatus = 'active' | 'archived' | 'trash';

export interface Document {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  folderId?: string;
  templateId?: string;
  status: DocumentStatus;
  createdAt: number;
  lastModified: number;
  tags: string[];
  isFavorite: boolean;
  wordCount: number;
  collaborators: string[];
}

export interface Folder {
  id: string;
  name: string;
  ownerId: string;
  parentFolderId?: string;
  createdAt: number;
  documentCount: number;
  color?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  createdBy: string;
  createdAt: number;
  usageCount: number;
  tags: string[];
  isPublic: boolean;
  category: 'marketing' | 'technical' | 'business' | 'personal' | 'other';
}

export interface SearchResult {
  documentId: string;
  title: string;
  snippet: string; // First 100 chars matching search
  relevance: number; // 0-100
  type: 'title' | 'content' | 'tag';
}

class DocumentManager {
  private documents: Map<string, Document> = new Map();
  private folders: Map<string, Folder> = new Map();
  private templates: Map<string, DocumentTemplate> = new Map();

  /**
   * Create document
   */
  createDocument(
    ownerId: string,
    title: string,
    content: string = '',
    templateId?: string,
    folderId?: string
  ): Document {
    const document: Document = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      ownerId,
      folderId,
      templateId,
      status: 'active',
      createdAt: Date.now(),
      lastModified: Date.now(),
      tags: [],
      isFavorite: false,
      wordCount: this.countWords(content),
      collaborators: [ownerId],
    };

    this.documents.set(document.id, document);

    // Update template usage
    if (templateId) {
      const template = this.templates.get(templateId);
      if (template) {
        template.usageCount++;
      }
    }

    return document;
  }

  /**
   * Update document
   */
  updateDocument(documentId: string, updates: Partial<Document>): Document | null {
    const doc = this.documents.get(documentId);
    if (!doc) return null;

    Object.assign(doc, updates);
    doc.lastModified = Date.now();

    if (updates.content) {
      doc.wordCount = this.countWords(updates.content);
    }

    return doc;
  }

  /**
   * Create folder
   */
  createFolder(ownerId: string, name: string, parentFolderId?: string, color?: string): Folder {
    const folder: Folder = {
      id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      ownerId,
      parentFolderId,
      createdAt: Date.now(),
      documentCount: 0,
      color,
    };

    this.folders.set(folder.id, folder);
    return folder;
  }

  /**
   * Create template
   */
  createTemplate(
    createdBy: string,
    name: string,
    description: string,
    content: string,
    category: DocumentTemplate['category'],
    isPublic: boolean = false
  ): DocumentTemplate {
    const template: DocumentTemplate = {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      content,
      createdBy,
      createdAt: Date.now(),
      usageCount: 0,
      tags: [],
      isPublic,
      category,
    };

    this.templates.set(template.id, template);
    return template;
  }

  /**
   * Search documents
   */
  search(userId: string, query: string, limit: number = 20): SearchResult[] {
    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();

    this.documents.forEach((doc) => {
      // Only search user's documents
      if (doc.ownerId !== userId && !doc.collaborators.includes(userId)) {
        return;
      }

      // Search title
      if (doc.title.toLowerCase().includes(queryLower)) {
        results.push({
          documentId: doc.id,
          title: doc.title,
          snippet: doc.content.substring(0, 100),
          relevance: 100,
          type: 'title',
        });
      }

      // Search content
      if (doc.content.toLowerCase().includes(queryLower)) {
        const index = doc.content.toLowerCase().indexOf(queryLower);
        const snippet = doc.content.substring(Math.max(0, index - 50), index + 50);

        results.push({
          documentId: doc.id,
          title: doc.title,
          snippet: `...${snippet}...`,
          relevance: 75,
          type: 'content',
        });
      }

      // Search tags
      if (doc.tags.some((tag) => tag.toLowerCase().includes(queryLower))) {
        results.push({
          documentId: doc.id,
          title: doc.title,
          snippet: `Tags: ${doc.tags.join(', ')}`,
          relevance: 50,
          type: 'tag',
        });
      }
    });

    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, limit);
  }

  /**
   * Get documents in folder
   */
  getDocumentsInFolder(userId: string, folderId: string): Document[] {
    return Array.from(this.documents.values()).filter(
      (doc) =>
        doc.ownerId === userId && doc.folderId === folderId && doc.status === 'active'
    );
  }

  /**
   * Get user's documents
   */
  getUserDocuments(userId: string, status: DocumentStatus = 'active'): Document[] {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.ownerId === userId && doc.status === status
    );
  }

  /**
   * Get public templates
   */
  getPublicTemplates(category?: DocumentTemplate['category']): DocumentTemplate[] {
    let templates = Array.from(this.templates.values()).filter((t) => t.isPublic);

    if (category) {
      templates = templates.filter((t) => t.category === category);
    }

    return templates.sort((a, b) => b.usageCount - a.usageCount);
  }

  /**
   * Add tag to document
   */
  addTag(documentId: string, tag: string): Document | null {
    const doc = this.documents.get(documentId);
    if (!doc) return null;

    if (!doc.tags.includes(tag.toLowerCase())) {
      doc.tags.push(tag.toLowerCase());
    }

    return doc;
  }

  /**
   * Toggle favorite
   */
  toggleFavorite(documentId: string): Document | null {
    const doc = this.documents.get(documentId);
    if (!doc) return null;

    doc.isFavorite = !doc.isFavorite;
    return doc;
  }

  /**
   * Move to trash
   */
  moveToTrash(documentId: string): Document | null {
    const doc = this.documents.get(documentId);
    if (!doc) return null;

    doc.status = 'trash';
    return doc;
  }

  /**
   * Archive document
   */
  archiveDocument(documentId: string): Document | null {
    const doc = this.documents.get(documentId);
    if (!doc) return null;

    doc.status = 'archived';
    return doc;
  }

  /**
   * Delete permanently
   */
  delete(documentId: string): boolean {
    return this.documents.delete(documentId);
  }

  /**
   * Get recent documents
   */
  getRecentDocuments(userId: string, limit: number = 10): Document[] {
    return Array.from(this.documents.values())
      .filter((doc) => doc.ownerId === userId && doc.status === 'active')
      .sort((a, b) => b.lastModified - a.lastModified)
      .slice(0, limit);
  }

  /**
   * Get starred documents
   */
  getStarredDocuments(userId: string): Document[] {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.ownerId === userId && doc.isFavorite && doc.status === 'active'
    );
  }

  // ==================== PRIVATE METHODS ====================

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }
}

export default new DocumentManager();
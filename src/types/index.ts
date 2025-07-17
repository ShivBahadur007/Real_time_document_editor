export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  collaborators: Collaborator[];
  isPublic: boolean;
  shareLink?: string;
  version: number;
  history: DocumentVersion[];
}

export interface Collaborator {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  addedAt: Date;
}

export interface DocumentVersion {
  id: string;
  version: number;
  content: string;
  timestamp: Date;
  authorId: string;
  changes: string;
}

export interface Cursor {
  userId: string;
  position: number;
  selection: { start: number; end: number } | null;
}

export interface AIsuggestion {
  id: string;
  type: 'grammar' | 'style' | 'tone' | 'summary';
  text: string;
  suggestion: string;
  confidence: number;
  position: { start: number; end: number };
}

export interface EditorState {
  content: string;
  cursors: Map<string, Cursor>;
  activeUsers: User[];
  isTyping: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}
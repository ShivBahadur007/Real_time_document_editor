import { useState, useEffect } from 'react';
import { Document, DocumentVersion } from '../types';

const DEMO_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Shiv Product Roadmap',
    content: `# Shiv Product Roadmap

## Q1 2025 Objectives

Welcome to our comprehensive product roadmap for Shiv. This document outlines our strategic initiatives and key milestones for the upcoming quarter.

### Core Platform Development
- **AI-Powered Document Analysis**: Implement advanced natural language processing capabilities
- **Real-time Collaboration**: Enhance multi-user editing experience with improved conflict resolution
- **Smart Suggestions Engine**: Deploy contextual AI recommendations for content improvement

### User Experience Enhancements
Our focus remains on delivering an intuitive and powerful user experience:

1. **Streamlined Interface Design**
   - Simplified navigation structure
   - Enhanced accessibility features
   - Mobile-responsive optimization

2. **Advanced Formatting Options**
   - Rich text editing capabilities
   - Template library expansion
   - Custom styling options

### Performance Optimizations
- Database query optimization
- CDN implementation for faster load times
- Caching strategies for improved responsiveness

### Security & Compliance
Ensuring data protection remains our top priority with enhanced encryption protocols and compliance with international data protection standards.

---

*Last updated: January 2025*
*Contributors: Alex Chen, Sarah Johnson, Marcus Williams*`,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    ownerId: '1',
    collaborators: [
      { userId: '1', role: 'owner', addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { userId: '2', role: 'editor', addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { userId: '3', role: 'viewer', addedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) }
    ],
    isPublic: false,
    version: 3,
    history: [
      {
        id: 'v1',
        version: 1,
        content: '# Boult AI Product Roadmap\n\nInitial draft...',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        authorId: '1',
        changes: 'Document created'
      },
      {
        id: 'v2',
        version: 2,
        content: '# Boult AI Product Roadmap\n\n## Q1 2025 Objectives\n\nAdded objectives section...',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        authorId: '2',
        changes: 'Added Q1 objectives and core platform section'
      }
    ]
  },
  {
    id: '2',
    title: 'Team Meeting Notes',
    content: `# Weekly Team Sync - January 15, 2025

## Attendees
- Alex Chen (Product Lead)
- Sarah Johnson (Engineering)
- Marcus Williams (Design)

## Agenda Items

### 1. Project Updates
- **Document Editor**: On track for beta release
- **AI Integration**: Testing phase complete
- **Mobile App**: Design review scheduled

### 2. Blockers & Challenges
- Performance optimization needed for large documents
- User feedback integration in progress

### 3. Action Items
- [ ] Finalize UI components by Friday
- [ ] Complete integration testing
- [ ] Prepare demo for stakeholders

### 4. Next Steps
Focus on user testing and feedback collection for the next iteration.`,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    ownerId: '1',
    collaborators: [
      { userId: '1', role: 'owner', addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { userId: '2', role: 'editor', addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
    ],
    isPublic: false,
    version: 2,
    history: []
  }
];

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>(DEMO_DOCUMENTS);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createDocument = async (title: string, ownerId: string) => {
    setIsLoading(true);
    
    const newDoc: Document = {
      id: Date.now().toString(),
      title,
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId,
      collaborators: [{ userId: ownerId, role: 'owner', addedAt: new Date() }],
      isPublic: false,
      version: 1,
      history: []
    };

    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDocuments(prev => [newDoc, ...prev]);
    setCurrentDocument(newDoc);
    setIsLoading(false);
    
    return newDoc;
  };

  const updateDocument = async (documentId: string, updates: Partial<Document>) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, ...updates, updatedAt: new Date(), version: doc.version + 1 }
          : doc
      )
    );

    if (currentDocument?.id === documentId) {
      setCurrentDocument(prev => 
        prev ? { ...prev, ...updates, updatedAt: new Date(), version: prev.version + 1 } : null
      );
    }
  };

  const deleteDocument = async (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    if (currentDocument?.id === documentId) {
      setCurrentDocument(null);
    }
  };

  const loadDocument = async (documentId: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const doc = documents.find(d => d.id === documentId);
    setCurrentDocument(doc || null);
    setIsLoading(false);
    
    return doc || null;
  };

  return {
    documents,
    currentDocument,
    isLoading,
    createDocument,
    updateDocument,
    deleteDocument,
    loadDocument,
    setCurrentDocument
  };
}
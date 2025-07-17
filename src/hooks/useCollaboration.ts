import { useState, useEffect, useCallback } from 'react';
import { User, Cursor, EditorState } from '../types';

export function useCollaboration(documentId: string | null, currentUser: User | null) {
  const [editorState, setEditorState] = useState<EditorState>({
    content: '',
    cursors: new Map(),
    activeUsers: [],
    isTyping: false,
    lastSaved: null,
    hasUnsavedChanges: false
  });

  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);

  // Simulate other users joining/leaving
  useEffect(() => {
    if (!documentId || !currentUser) return;

    const interval = setInterval(() => {
      setEditorState(prev => {
        const activeUsers = [...prev.activeUsers];
        const random = Math.random();
        
        if (random > 0.7 && activeUsers.length < 3) {
          // Simulate user joining
          const demoUsers = [
            {
              id: 'demo-1',
              name: 'Emma Davis',
              email: 'emma@shiv.ai',
              avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
              color: '#f59e0b',
              isOnline: true,
              lastSeen: new Date()
            },
            {
              id: 'demo-2',
              name: 'David Kim',
              email: 'david@shiv.ai',
              avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
              color: '#ef4444',
              isOnline: true,
              lastSeen: new Date()
            }
          ];
          
          const newUser = demoUsers.find(u => !activeUsers.some(au => au.id === u.id));
          if (newUser) {
            activeUsers.push(newUser);
          }
        } else if (random < 0.1 && activeUsers.length > 0) {
          // Simulate user leaving
          activeUsers.splice(Math.floor(Math.random() * activeUsers.length), 1);
        }

        return { ...prev, activeUsers };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [documentId, currentUser]);

  const updateCursor = useCallback((position: number, selection: { start: number; end: number } | null = null) => {
    if (!currentUser) return;

    setEditorState(prev => {
      const newCursors = new Map(prev.cursors);
      newCursors.set(currentUser.id, { userId: currentUser.id, position, selection });
      return { ...prev, cursors: newCursors };
    });
  }, [currentUser]);

  const updateContent = useCallback((content: string) => {
    setEditorState(prev => ({
      ...prev,
      content,
      hasUnsavedChanges: true,
      isTyping: true
    }));

    // Clear existing timer
    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    // Set new timer to stop typing indicator
    const newTimer = setTimeout(() => {
      setEditorState(prev => ({ ...prev, isTyping: false }));
    }, 1000);

    setTypingTimer(newTimer);
  }, [typingTimer]);

  const saveDocument = useCallback(async () => {
    setEditorState(prev => ({
      ...prev,
      lastSaved: new Date(),
      hasUnsavedChanges: false
    }));

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (!editorState.hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(() => {
      saveDocument();
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [editorState.hasUnsavedChanges, saveDocument]);

  return {
    editorState,
    updateCursor,
    updateContent,
    saveDocument,
    setContent: (content: string) => setEditorState(prev => ({ ...prev, content }))
  };
}
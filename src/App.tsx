import React, { useState } from 'react';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { RichTextEditor } from './components/Editor/RichTextEditor';
import { AIAssistant } from './components/Editor/AIAssistant';
import { UserPresence } from './components/Collaboration/UserPresence';
import { DocumentVersions } from './components/Documents/DocumentVersions';
import { useAuth } from './hooks/useAuth';
import { useDocuments } from './hooks/useDocuments';
import { useCollaboration } from './hooks/useCollaboration';
import { useAISuggestions } from './hooks/useAISuggestions';
import { History } from 'lucide-react';

function App() {
  const { currentUser, isAuthenticated, isLoading: authLoading, login, logout, allUsers } = useAuth();
  const { 
    documents, 
    currentDocument, 
    isLoading: docsLoading, 
    createDocument, 
    updateDocument, 
    deleteDocument, 
    loadDocument 
  } = useDocuments();
  
  const { 
    editorState, 
    updateContent, 
    updateCursor, 
    saveDocument,
    setContent 
  } = useCollaboration(currentDocument?.id || null, currentUser);
  
  const { 
    suggestions, 
    isAnalyzing, 
    applySuggestion, 
    dismissSuggestion 
  } = useAISuggestions(editorState.content);

  const [showVersions, setShowVersions] = useState(false);

  React.useEffect(() => {
    if (currentDocument && editorState.content !== currentDocument.content) {
      setContent(currentDocument.content);
    }
  }, [currentDocument, setContent]);

  const handleCreateDocument = async () => {
    if (!currentUser) return;
    
    const title = prompt('Enter document title:');
    if (!title) return;
    
    await createDocument(title, currentUser.id);
  };

  const handleSelectDocument = async (doc: typeof documents[0]) => {
    await loadDocument(doc.id);
  };

  const handleDeleteDocument = async (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(docId);
    }
  };

  const handleContentChange = (content: string) => {
    updateContent(content);
    
    if (currentDocument) {
      updateDocument(currentDocument.id, { content });
    }
  };

  const handleRestoreVersion = (version: any) => {
    if (currentDocument) {
      updateDocument(currentDocument.id, { content: version.content });
      setContent(version.content);
      setShowVersions(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Shiv...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <LoginForm onLogin={login} isLoading={authLoading} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        currentUser={currentUser}
        documentTitle={currentDocument?.title || ''}
        activeUsers={editorState.activeUsers}
        lastSaved={editorState.lastSaved}
        hasUnsavedChanges={editorState.hasUnsavedChanges}
        onSave={saveDocument}
        onLogout={logout}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          documents={documents}
          currentDocument={currentDocument}
          currentUser={currentUser}
          onCreateDocument={handleCreateDocument}
          onSelectDocument={handleSelectDocument}
          onDeleteDocument={handleDeleteDocument}
        />
        
        <div className="flex-1 flex flex-col">
          {currentDocument ? (
            <>
              {/* Document Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 flex-1 min-w-0">
                  <input
                    type="text"
                    value={currentDocument.title}
                    onChange={(e) => updateDocument(currentDocument.id, { title: e.target.value })}
                    className="bg-transparent border-none outline-none w-full truncate"
                    placeholder="Untitled Document"
                  />
                </h1>
                
                <button
                  onClick={() => setShowVersions(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <History className="w-4 h-4" />
                  <span className="text-sm">History</span>
                </button>
              </div>

              {/* Editor */}
              <div className="flex-1 flex">
                <div className="flex-1">
                  <RichTextEditor
                    content={editorState.content}
                    onChange={handleContentChange}
                    onCursorChange={updateCursor}
                    className="h-full"
                  />
                </div>
                
                {!showVersions && (
                  <AIAssistant
                    suggestions={suggestions}
                    isAnalyzing={isAnalyzing}
                    onApplySuggestion={applySuggestion}
                    onDismissSuggestion={dismissSuggestion}
                  />
                )}
                
                {showVersions && (
                  <DocumentVersions
                    versions={currentDocument.history}
                    users={allUsers}
                    onClose={() => setShowVersions(false)}
                    onRestoreVersion={handleRestoreVersion}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Boult AI</h2>
                <p className="text-gray-600 mb-6">Create a new document or select an existing one to start collaborating</p>
                <button
                  onClick={handleCreateDocument}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create New Document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Presence */}
      {currentDocument && editorState.activeUsers.length > 1 && (
        <UserPresence
          activeUsers={editorState.activeUsers}
          currentUserId={currentUser.id}
        />
      )}
    </div>
  );
}

export default App;
import React from 'react';
import { Clock, User, ArrowLeft } from 'lucide-react';
import { DocumentVersion, User as UserType } from '../../types';

interface DocumentVersionsProps {
  versions: DocumentVersion[];
  users: UserType[];
  onClose: () => void;
  onRestoreVersion: (version: DocumentVersion) => void;
}

export function DocumentVersions({ versions, users, onClose, onRestoreVersion }: DocumentVersionsProps) {
  const getUserById = (userId: string) => users.find(u => u.id === userId);

  const formatTime = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Version History</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {versions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No version history available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version) => {
              const author = getUserById(version.authorId);
              
              return (
                <div
                  key={version.id}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        v{version.version}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        Version {version.version}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <User className="w-3 h-3" />
                      <span>{author?.name || 'Unknown User'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(version.timestamp)}</span>
                    </div>
                    
                    <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                      {version.changes}
                    </p>
                  </div>

                  <button
                    onClick={() => onRestoreVersion(version)}
                    className="mt-3 w-full bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Restore This Version
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { FileText, Users, Save, Settings, LogOut, ChevronDown } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  currentUser: User;
  documentTitle: string;
  activeUsers: User[];
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onLogout: () => void;
}

export function Header({
  currentUser,
  documentTitle,
  activeUsers,
  lastSaved,
  hasUnsavedChanges,
  onSave,
  onLogout
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Shiv</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
          <span>/</span>
          <span className="font-medium">{documentTitle || 'Untitled Document'}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Save Status */}
        <div className="hidden md:flex items-center space-x-2 text-sm">
          {hasUnsavedChanges ? (
            <div className="flex items-center space-x-2 text-orange-600">
              <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
              <span>Unsaved changes</span>
            </div>
          ) : lastSaved ? (
            <div className="flex items-center space-x-2 text-green-600">
              <Save className="w-4 h-4" />
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          ) : null}
        </div>

        {/* Active Users */}
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-500" />
          <div className="flex -space-x-2">
            {activeUsers.slice(0, 3).map((user) => (
              <img
                key={user.id}
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                title={user.name}
              />
            ))}
            {activeUsers.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                +{activeUsers.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* User Menu */}
        <div className="relative group">
          <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full"
            />
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-3 border-b border-gray-100">
              <p className="font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
            </div>
            <div className="p-2">
              <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Settings</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
import React from 'react';
import { User } from '../../types';

interface UserPresenceProps {
  activeUsers: User[];
  currentUserId: string;
}

export function UserPresence({ activeUsers, currentUserId }: UserPresenceProps) {
  const otherUsers = activeUsers.filter(user => user.id !== currentUserId);

  if (otherUsers.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-40">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Active Users</h4>
        <div className="space-y-2">
          {otherUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-2">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full"
                />
                <div 
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: user.color }}
                ></div>
              </div>
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
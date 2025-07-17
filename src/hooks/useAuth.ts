import { useState, useEffect } from 'react';
import { User } from '../types';

const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'Alex Chen',
    email: 'alex@shiv.ai',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    color: '#3b82f6',
    isOnline: true,
    lastSeen: new Date()
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@shiv.ai',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    color: '#10b981',
    isOnline: true,
    lastSeen: new Date()
  },
  {
    id: '3',
    name: 'Marcus Williams',
    email: 'marcus@shiv.ai',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    color: '#8b5cf6',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000)
  }
];

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate authentication check
    const timer = setTimeout(() => {
      const user = DEMO_USERS[0]; // Default to first user for demo
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user = DEMO_USERS.find(u => u.email === email) || DEMO_USERS[0];
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    allUsers: DEMO_USERS
  };
}
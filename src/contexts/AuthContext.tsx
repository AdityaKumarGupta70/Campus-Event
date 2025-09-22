import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'faculty' | 'student' | 'alumni';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const demoCredentials = [
  { username: 'college001', password: 'admin123', role: 'admin' as const, name: 'Admin User', id: '1' },
  { username: 'faculty123', password: 'password123', role: 'faculty' as const, name: 'Faculty User', id: '2' },
  { username: '2023CS01', password: 'pass123', role: 'student' as const, name: 'Student User', id: '3' },
  { username: 'alumni', password: 'pass1234', role: 'alumni' as const, name: 'Alumni User', id: '4' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const foundUser = demoCredentials.find(
      cred => cred.username === username && cred.password === password
    );
    
    if (foundUser) {
      setUser({
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        name: foundUser.name,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
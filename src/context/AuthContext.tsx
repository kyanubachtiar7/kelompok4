import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  username: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  register: (user: string, pass: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Cek localStorage saat inisialisasi
    try {
      const storedAuth = localStorage.getItem('authStatus');
      return storedAuth ? JSON.parse(storedAuth).isAuthenticated : false;
    } catch {
      return false;
    }
  });

  const [users, setUsers] = useState<User[]>([
    { username: 'kelompok4', password: 'kelompok4' }
  ]);

  const login = (username: string, pass: string) => {
    const user = users.find(u => u.username === username && u.password === pass);
    if (user) {
      setIsAuthenticated(true);
      // Simpan status login ke localStorage
      localStorage.setItem('authStatus', JSON.stringify({ isAuthenticated: true, username }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Hapus status login dari localStorage
    localStorage.removeItem('authStatus');
  };

  const register = (username: string, pass: string) => {
    const userExists = users.some(u => u.username === username);
    if (userExists) {
      return false; // Username sudah ada
    }
    setUsers(prevUsers => [...prevUsers, { username, password: pass }]);
    return true;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
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
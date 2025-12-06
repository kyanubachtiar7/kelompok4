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
    try {
      const storedAuth = localStorage.getItem('authStatus');
      return storedAuth ? JSON.parse(storedAuth).isAuthenticated : false;
    } catch {
      return false;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem('appUsers');
      if (storedUsers) {
        return JSON.parse(storedUsers);
      }
    } catch (e) {
      console.error("Gagal memuat pengguna dari localStorage", e);
    }
    return [{ username: 'kelompok4', password: 'kelompok4' }];
  });

  useEffect(() => {
    try {
      localStorage.setItem('appUsers', JSON.stringify(users));
    } catch (e) {
      console.error("Gagal menyimpan pengguna ke localStorage", e);
    }
  }, [users]);

  const login = (username: string, pass: string) => {
    const user = users.find(u => u.username === username && u.password === pass);
    if (user) {
      setIsAuthenticated(true);
      localStorage.setItem('authStatus', JSON.stringify({ isAuthenticated: true, username }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
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
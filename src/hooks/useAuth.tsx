import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, login: () => {}, logout: () => {}, updateUser: () => {}, isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('jwt_token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object') {
          setToken(savedToken);
          setUser(parsed);
        } else {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (t: string, u: User) => {
    if (!t || !u) return;
    setToken(t);
    setUser(u);
    localStorage.setItem('jwt_token', t);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
  };

  const updateUser = (u: User) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

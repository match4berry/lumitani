import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  phone?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'lumitani_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Load auth state from localStorage on init
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const authData = JSON.parse(stored);
        setIsLoggedIn(authData.isLoggedIn);
        setUser(authData.user);
      }
    } catch (error) {
      console.error('Error loading auth from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever auth state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isLoggedIn, user }));
    } catch (error) {
      console.error('Error saving auth to localStorage:', error);
    }
  }, [isLoggedIn, user]);

  const login = (email: string, name: string) => {
    setIsLoggedIn(true);
    setUser({ email, name });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
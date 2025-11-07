import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  username: string;
  name: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await authService.getCurrentUser(storedToken);
          if (userData && userData.user) {
            setUser(userData.user);
          } else {
            // Token invalide ou expiré - mais on garde le token pour réessayer
            console.warn('Réponse utilisateur invalide, mais on garde le token');
            setUser(null);
          }
        } catch (error: any) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          // Seulement supprimer le token si c'est une erreur 401/403 (non autorisé)
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('Token invalide ou expiré, suppression');
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          } else {
            // Pour les autres erreurs (réseau, serveur), on garde le token
            console.log('Erreur réseau ou serveur, on garde le token pour réessayer');
            setUser(null);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await authService.login(username, password);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
  }, []);

  const register = useCallback(async (username: string, password: string, name: string) => {
    const response = await authService.register(username, password, name);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};


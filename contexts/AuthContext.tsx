import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      console.log('Début du chargement de l\'authentification...');
      
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUserData = await AsyncStorage.getItem('user_data');

      console.log('Token récupéré:', storedToken ? 'Oui' : 'Non');
      console.log('Données utilisateur récupérées:', storedUserData ? 'Oui' : 'Non');

      if (storedToken && storedUserData) {
        const storedUser = JSON.parse(storedUserData);
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
        console.log('Authentification restaurée avec succès');
      } else {
        console.log('Aucune authentification stockée trouvée');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'authentification:', error);
    } finally {
      setLoading(false);
      console.log('Chargement de l\'authentification terminé');
    }
  };

  const login = async (newToken: string, newUser: User) => {
    try {
      await AsyncStorage.setItem('auth_token', newToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Début de la déconnexion...');
      
      // Supprimer les données du stockage
      await AsyncStorage.multiRemove(['auth_token', 'user_data']);
      console.log('Données supprimées du stockage');
      
      // Réinitialiser l'état
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      console.log('État réinitialisé');
      
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      
      // Même en cas d'erreur, on force la déconnexion
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      console.log('Déconnexion forcée en cas d\'erreur');
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

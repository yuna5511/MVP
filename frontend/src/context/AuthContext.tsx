import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import axios from 'axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUserProfile: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth は AuthProvider 内で使用する必要があります。');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/login', { email, password });
    const { token, user: userData } = response.data;
    sessionStorage.setItem('token', token);
    setUser(userData);
  };

  const setUserProfile = (user: User) => setUser(user);

  const logout = async () => {
    sessionStorage.removeItem('token');
    setUser(null);
  };

  const fetchUserProfile = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in Authorization header
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Automatically fetch user data on app load
  }, []);

  if (isLoading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setUserProfile, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { useState, useEffect } from 'react';

type UserRole = 'TRANSPORTER' | 'NORMAL';

interface UserData {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password: string;
  cnh: string;
  vehicleInfo: string;
  isVerified: boolean;
  totalTrips: number;
  totalKm: number;
  animalsTransported: number;
  createdAt: string;
  cpf: string | null;
  cnpj: string | null;
  cnhNumber: string | null;
  vehicleType: string;
  vehiclePlate: string;
  documentFrontUrl: string | null;
  documentBackUrl: string | null;
  cnhUrl: string | null;
  selfieUrl: string | null;
  vehicleDocumentUrl: string | null;
}

interface UseAuthReturn {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = () => {
      const userDataString = localStorage.getItem('userData');
      const token = localStorage.getItem('token');

      if (!userDataString || !token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const userData: UserData = JSON.parse(userDataString);
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const isTokenExpired = tokenPayload.exp * 1000 < Date.now();

        if (isTokenExpired) {
          localStorage.removeItem('userData');
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        } else {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error parsing user data or token:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // <-- Sempre termina o loading
      }
    };

    fetchUserData();
  }, []);

  return { user, isAuthenticated, isLoading };
};

export default useAuth;

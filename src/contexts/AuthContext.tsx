import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email: string;
  role: "admin" | "doctor";
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isDoctor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
              const response = await axios.post(API_ENDPOINTS.refreshToken, {
                refresh: refreshToken,
              });

              const { access } = response.data;
              localStorage.setItem("accessToken", access);
              originalRequest.headers.Authorization = `Bearer ${access}`;

              return axios(originalRequest);
            }
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        try {
          // Decode token to get user data
          const decodedToken: any = jwtDecode(accessToken);
          
          const userData: User = {
            id: decodedToken.user_id || decodedToken.id,
            email: decodedToken.email,
            role: decodedToken.role || "doctor",
            name: decodedToken.email?.split('@')[0],
          };
          
          setUser(userData);
          axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        } catch (error) {
          console.error("Error restoring session:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(API_ENDPOINTS.login, {
      email,
      password,
    });

    const responseData = response.data;
    const access = responseData.access || responseData.access_token;
    const refresh = responseData.refresh || responseData.refresh_token;

    if (!access || !refresh) {
      throw new Error("Invalid response: missing tokens");
    }

    // Decode JWT token to get user data including role
    const decodedToken: any = jwtDecode(access);
    
    const userData: User = {
      id: decodedToken.user_id || decodedToken.id,
      email: decodedToken.email || email,
      role: decodedToken.role || "doctor",
      name: responseData.name || responseData.first_name || decodedToken.email?.split('@')[0],
    };

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAdmin,
        isDoctor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set axios default auth header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Base URL for API - defaults to local, adapts via Vercel env
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  axios.defaults.baseURL = API_URL;

  useEffect(() => {
    // Interceptor to handle 401 Unauthorized globally
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("401 Unauthorized received. Logging out...");
          logout();
        }
        return Promise.reject(error);
      }
    );

    const checkUserLoggedIn = async () => {
      try {
        if (token) {
          // If we had a /me endpoint we would verify the token here
          // For now, let's decode from JWT payload or rely on the components making successful requests
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({ id: payload.id }); // we can't get role right away unless we change backend to return it in JWT or keep it in localStorage
          
          // Let's get the user from localStorage for now since we returned it in login
          const storedUser = localStorage.getItem('user');
          if (storedUser) setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Token verification failed", error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      setToken(token);
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const signup = async (email, password, role) => {
    try {
      const response = await axios.post('/auth/signup', { email, password, role });
      const { token, ...userData } = response.data;
      
      setToken(token);
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

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

  // Base URL for API
  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
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
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token, ...userData } = response.data;
    
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const signup = async (email, password, role) => {
    const response = await axios.post(`${API_URL}/auth/signup`, { email, password, role });
    const { token, ...userData } = response.data;
    
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
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

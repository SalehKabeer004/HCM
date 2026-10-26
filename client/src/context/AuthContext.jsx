import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) return JSON.parse(saved);
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        const parts = savedToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          return {
            id: payload.id,
            role: payload.role || 'Employee',
            name: payload.name || payload.email?.split('@')[0] || 'User',
            email: payload.email || ''
          };
        }
      }
    } catch {
      // fallback
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Set axios default authorization header when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.BACKEND_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { success: true, user: response.data.user };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Login failed. Please check your credentials.' 
      };
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

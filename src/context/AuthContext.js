import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api'; // Our configured Axios instance
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await api.get('/auth/profile');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // Token might be invalid or expired, clear and force re-login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      // Fetch user profile after successful login
      const userResponse = await api.get('/auth/profile');
      setUser(userResponse.data);
      setIsAuthenticated(true);
      navigate('/dashboard'); // Redirect to dashboard or home after login
      return true;
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      await api.post('/auth/register', { username, email, password });
      // Optionally log in user immediately after registration
      return login(email, password);
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login'); // Redirect to login page after logout
  };

  // Function to check if user is enrolled in a specific course
  const isEnrolled = async (courseId) => {
    if (!isAuthenticated || !user) return false;
    try {
      const response = await api.get(`/courses/my-courses`);
      const enrolledCourses = response.data;
      return enrolledCourses.some(course => course.id === courseId);
    } catch (error) {
      console.error("Failed to check enrollment status:", error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    isEnrolled,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
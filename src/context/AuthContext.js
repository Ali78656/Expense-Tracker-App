import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Base URL for your backend API
  const API_URL = "http://localhost:5000/api/auth";

  // Load token from localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      setToken(storedToken);
      // In a real app, you'd verify this token with your backend to get user info
      // For now, we'll just assume it's valid and decode user info locally (NOT secure for production)
      try {
        const decodedUser = JSON.parse(atob(storedToken.split(".")[1])); // Basic JWT decode
        setUser(decodedUser);
      } catch (error) {
        console.error("Failed to decode token", error);
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("jwtToken", token);
    } else {
      localStorage.removeItem("jwtToken");
    }
  }, [token]);

  const registerUser = async (email, password) => {
    try {
      await axios.post(`${API_URL}/register`, { email, password });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || "Registration failed",
      };
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      setToken(response.data.token);
      const decodedUser = JSON.parse(atob(response.data.token.split(".")[1]));
      setUser(decodedUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || "Login failed",
      };
    }
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    registerUser,
    loginUser,
    logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

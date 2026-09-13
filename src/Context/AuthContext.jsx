import { createContext, useState, useContext, useEffect, useCallback } from "react";
import React from "react";
import api from '../api/http'
import useAuthStore from '../api/token';
import ApiError from "../api/apiError";





// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

// get current user
  const user = async () => {
    try {

      const response = await api.get("/auth/profile");
      console.log(response)
      return response.user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  }

  const currentUser = await user()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // login
  const login = async ({ email, password }) => {
    try {      
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;
      const { token, User } = data;

      setIsAuthenticated(true);

      return { data, response, success: true, ok: true };
    } catch (error) {
    
      if (error instanceof ApiError) return { success: false, error: error.message };   
      console.log(error)
    }
  };

  
  // console.log(user())


  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map(n => n[0].toUpperCase()).join('');
    return initials;
  }


  const clearToken = useAuthStore((state) => state.logout);

  const logout = async () => {
    const res = await api.post("/auth/logout");
    clearToken();
    console.log(res)
    return res;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, getInitials, currentUser, logout}}>
      {children}
    </AuthContext.Provider>
  )
}





export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

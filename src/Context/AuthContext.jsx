import { createContext, useState, useContext, useEffect, useCallback } from "react";
import React from "react";
import api from '../api/http'
import useAuthStore from '../api/token';
import ApiError from "../api/apiError";
// import { user } from '../api/auth.api'



// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

// get current user
const user = async () => {
  try {
    const response = await api.get("/auth/profile");


    // setCurrentUser(response.user);
    

    return response.user;
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
      };
    }

    console.error("Error fetching current user:", error);
  }
};

const getCurrentUser = await user();





export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setOtpId = useAuthStore((state) => state.setOtpId);
  const otpId = useAuthStore((state) => state.otpId);

  const [currentUser, setCurrentUser] = useState(getCurrentUser);

  //Register
  const register = async ({ name, email, password }) => {
    try {
      const response = await api.post("/auth/register", { name, email, password });
      setOtpId(response.otpId)
      const data = response.data;
      return { data, response, success: true, ok: true };
    } catch (error) {
      if (error instanceof ApiError) return { success: false, error: error.message };
      console.error(error)
    }
  };

  // login
  const login = async ({ email, password }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;
      const { token, User } = data;

      setCurrentUser(User);
      setIsAuthenticated(true);
      setAccessToken(token);

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
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, register, getInitials, user, logout, currentUser, otpId }}>
      {children}
    </AuthContext.Provider>
  )
}





export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

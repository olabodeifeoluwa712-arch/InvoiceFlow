import { createContext, useState, useContext, useEffect, useCallback } from "react";
import React from "react";
import api from '../api/http'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from '../api/token';
import ApiError from "../api/apiError";





// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser)
  const accessToken = useAuthStore((state) => state.accessToken);

  // login
  const login = async ({ email, password }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;
      const { token, User } = data;


      setAccessToken(token)
      setCurrentUser(User)
      console.log(currentUser, token)
      setIsAuthenticated(true);

      return { data, response, success: true, ok: true };
    } catch (error) {

      if (error instanceof ApiError) return { success: false, error: error.message };
      console.log(error)
    }
  };

  // get current user
  const user = async () => {
    try {
      const accessToken = useAuthStore((state) => state.accessToken);
      const setAccessToken = useAuthStore((state) => state.setAccessToken);

      const response = await api.get("/auth/profile");
      console.log(response)
      return response;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }
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
  const currentUser = useAuthStore((state) => state.currentUser)
  const createBusiness = async (data) => {
    try {
      const userId = currentUser._id;
      const res = await api.post(`/business/${userId}`, data);
      console.log(res)
      return { res, ok: true, success: true };
    } catch (error) {
      if (error instanceof ApiError) return { success: false, error: `Error creating businessProfile:${error.message}` }
      console.error(error);
      return null;
    }
  }
  const uploadDocument = async (documents) => {
    try {
      const formData = new FormData();

      formData.append("passportPhoto", documents.passportPhoto);
      formData.append("idDocument", documents.idDocument);
      formData.append("proofOfAddress", documents.proofOfAddress);
 console.log("FILES BEING SENT:", documents);
      const res = await api.patch("business/documents", formData);

      console.log("UPLOAD RESPONSE:", res);

      return res;
    } catch (error) {
      console.error("Error uploading documents:", error);
      throw error;
    }
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, getInitials, currentUser, createBusiness, uploadDocument, user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}





export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

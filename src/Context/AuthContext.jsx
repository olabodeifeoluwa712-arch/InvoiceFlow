import { createContext, useState, useContext, useEffect, useCallback } from "react";
import React from "react";

const ACCOUNT_KEY = "invoiceflow";
const SESSION_KEY = "session";

const saveAccount = (account) => {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
};

const getAccount = (account) => {
    try {
        return JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "[]");
    } catch (error) {
        console.error("Error parsing account from localStorage:", error);
        return [];
    }
  }

const getSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
};

const saveSession  = (user) => localStorage.setItem(SESSION_KEY, JSON.stringify(user));
const clearSession = ()     => localStorage.removeItem(SESSION_KEY);

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Rehydrate from localStorage on first load
  const [currentUser,      setCurrentUser]      = useState(() => getSession());
  const [isAuthenticated,  setIsAuthenticated]  = useState(() => !!getSession());

  // ── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(({ email, password, firstName, lastName, role }) => {
    const accounts = getAccount();

    // Validate uniqueness
    if (accounts.find(a => a.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with that email already exists.' };
    }

    const newUser = {
      id:         `u_${Date.now()}`,
      email:      email.trim().toLowerCase() || '',
      password,                                   // NOTE: plaintext only for demo
      firstName:  firstName|| 'User',
      lastName:   lastName  || '',
      username:   email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase() || '',
      role: role.trim().toLowerCase() || 'user',
      createdAt:  new Date().toISOString(),
    };

    saveAccount([...accounts, newUser]);
     // Strip password before storing in session
    const { password: _pw, ...sessionUser } = newUser;
    saveSession(sessionUser);
    setCurrentUser(sessionUser);
    setIsAuthenticated(true);
    return { success: true, user: newUser };
    }, []);


    // ── Login ────────────────────────────────────────────────────────────────────
  const login = useCallback(({ email, password }) => {
    const accounts = getAccount();
    const found    = accounts.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (!found) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const { password: _pw, ...sessionUser } = found;
    saveSession(sessionUser);
    setCurrentUser(sessionUser);
    setIsAuthenticated(true);
    return { success: true, user: sessionUser };
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);
  const getInitials = (name) => {
  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

  return (
  <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, login, register, logout, currentUser, setCurrentUser,getInitials}}>
    {children}
  </AuthContext.Provider>
  )
}





export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

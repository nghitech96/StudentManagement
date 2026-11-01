import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api/http.js";

const STORAGE_KEY = "student-management-user";
const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  async function login(email, password) {
    const account = await api.login({ username: email, password });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    setUser(account);
    return account;
  }

  async function register(details) {
    return api.register(details);
  }

  async function logout() {
    try {
      await api.logout();
    } finally {
      window.localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider.");
  }
  return context;
}

export { STORAGE_KEY };

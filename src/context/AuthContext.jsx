import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/user");
      console.log("USER OK", response.data);
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const register = async (payload) => {
    await api.get("/sanctum/csrf-cookie");
    const response = await api.post("/api/register", payload);
    return response.data;
  };

  const login = async (payload) => {
    await api.get("/sanctum/csrf-cookie");
    const response = await api.post("/api/login", payload);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    await api.post("/api/logout");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      authLoading,
      isAuthenticated: !!user,
      register,
      login,
      logout,
      refreshUser: fetchUser,
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
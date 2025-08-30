import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const api = axios.create({
  baseURL: "https://missionsakhi.onrender.com/api/users",
  withCredentials: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });
      setUser(res.data.user);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const googleLogin = async (tokenId) => {
    try {
      const res = await api.post("/login/google", { tokenId });
      setUser(res.data.user);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Google login failed");
    }
  };

  const signup = async (formData) => {
    try {
      await api.post("/register", formData);
      await login(formData.email, formData.password);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, googleLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

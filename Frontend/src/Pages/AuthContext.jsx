import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider, isConfigured } from "../firebase";
import { AUTH_BASE } from "../apiConfig";

const AuthContext = createContext();

const api = axios.create({
  baseURL: AUTH_BASE,
  withCredentials: true,
});

// Attach token from localStorage on every request as fallback
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Start as loading=true so nothing renders until session is checked
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConfigured) {
      const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          const res = await api.get("/me");
          setUser(res.data.message);
        } catch {
          setUser(null);
        } finally {
          setLoading(false);
        }
      });
      return unsub;
    } else {
      api.get("/me")
        .then((res) => setUser(res.data.message))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }
  }, []);

  // Block ALL rendering until session check is complete
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#fdf0f5 0%,#f7f0ff 50%,#fdf0f5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "2.5rem", height: "2.5rem",
            border: "3px solid rgba(139,92,246,0.2)",
            borderTopColor: "#8b5cf6",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
            margin: "0 auto 1rem",
          }} />
          <p style={{ color: "#6b5b7b", fontSize: "0.875rem", fontFamily: "Inter, sans-serif" }}>Loading…</p>
        </div>
      </div>
    );
  }

  const login = async (email, password) => {
    if (isConfigured) {
      await signInWithEmailAndPassword(auth, email, password);
    }
    const res = await api.post("/login", { email, password });
    const userData = res.data.message.user;
    // Store token in localStorage as fallback for session persistence
    if (res.data.message.accessToken) {
      localStorage.setItem("accessToken", res.data.message.accessToken);
    }
    setUser(userData);
  };

  const googleLogin = async () => {
    if (!isConfigured) throw new Error("Firebase not configured");
    const result = await signInWithPopup(auth, googleProvider);
    const tokenId = await result.user.getIdToken();
    const res = await api.post("/login/google", { tokenId });
    if (res.data.message.accessToken) {
      localStorage.setItem("accessToken", res.data.message.accessToken);
    }
    setUser(res.data.message.user);
  };

  const signup = async (formData) => {
    if (isConfigured) {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    }
    await api.post("/register", formData);
    const res = await api.post("/login", { email: formData.email, password: formData.password });
    if (res.data.message.accessToken) {
      localStorage.setItem("accessToken", res.data.message.accessToken);
    }
    setUser(res.data.message.user);
  };

  const logout = async () => {
    if (isConfigured) {
      try { await signOut(auth); } catch { }
    }
    try { await api.post("/logout"); } catch { }
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, signup, googleLogin, loading, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

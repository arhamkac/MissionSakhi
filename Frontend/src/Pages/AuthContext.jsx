import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const baseUrl = "https://missionsakhi.onrender.com/api/users";

const api = axios.create({
  baseURL: "https://missionsakhi.onrender.com/api/users",
  withCredentials: true
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    if (storedUser && accessToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser({ ...parsedUser, token: accessToken });
    }
    setLoading(false);
  }, []);

  const saveSession = (user, accessToken, refreshToken) => {
    const userWithToken = { ...user, token: accessToken };
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userWithToken));
    setUser(userWithToken);
  };

  const googleLogin = async (tokenId) => {
    try {
      const res = await api.post("/login/google", { tokenId });
      const { user, accessToken, refreshToken } = res.data.message;
      saveSession(user, accessToken, refreshToken);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Google login failed");
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });
      if (res.status === 200) {
        const { user, accessToken, refreshToken } = res.data.message;
        saveSession(user, accessToken, refreshToken);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const signup = async (formData) => {
    try {
      const res = await api.post("/register", formData);
      if (res.status === 201 || res.status === 200) {
        await login(formData.email, formData.password);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  const logout = async() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const lo=await api.post("/logout",{},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if(lo.status==200||lo.status==201){
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
      }
      setUser(null)
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

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseUrl = "https://missionsakhi.onrender.com/api/users";

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // ensure token is attached
      setUser(parsedUser.token ? parsedUser : { ...parsedUser, token: localStorage.getItem("accessToken") });
    }
    setLoading(false);
  }, []);

  const googleLogin = async (tokenId) => {
    try {
      const res = await axios.post(`${baseUrl}/login/google`, { tokenId });
      const { user, accessToken, refreshToken } = res.data.message;
      const userWithToken = { ...user, token: accessToken };
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      setUser(userWithToken);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Google login failed");
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${baseUrl}/login`, { email, password });
      if (res.status === 200) {
        const { user, accessToken, refreshToken } = res.data.message;
        const userWithToken = { ...user, token: accessToken };
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(userWithToken));
        setUser(userWithToken);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const signup = async (formData) => {
    try {
      console.log(formData)
      const res = await axios.post(`${baseUrl}/register`, formData);
      if (res.status === 201 || res.status === 200) {
        await login(formData.email, formData.password);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Signup failed");
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

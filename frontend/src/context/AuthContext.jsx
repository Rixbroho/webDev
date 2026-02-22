import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    const decoded = jwtDecode(userData.token);
    setUser({
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
    });
    localStorage.setItem("token-37c", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token-37c");
  };

  useEffect(() => {
    const token = localStorage.getItem("token-37c");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp > currentTime) {
          setUser({
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
          });
        } else {
          localStorage.removeItem("token-37c");
        }
      } catch (error) {
        localStorage.removeItem("token-37c");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

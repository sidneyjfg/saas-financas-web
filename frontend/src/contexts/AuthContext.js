import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Armazena os dados completos do usuário

  const signIn = async (email, password) => {
    try {
      const response = await api.post("/users/login", { email, password });
      const { token, user } = response.data;

      setIsAuthenticated(true);
      setUser(user); // Armazena os dados completos do usuário
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Salva os dados no localStorage
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser)); // Carrega os dados do usuário do storage
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

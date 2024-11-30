import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api"; // Certifique-se de que este arquivo exporta o Axios configurado

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPlan, setUserPlan] = useState(null);

  const signIn = async (email, password) => {
    try {
      const response = await api.post("/users/login", { email, password }); // Chama o backend
      const { token, plan } = response.data; // Extrai token e plano da resposta

      setIsAuthenticated(true);
      setUserPlan(plan);
      localStorage.setItem("token", token); // Salva no localStorage
      localStorage.setItem("userPlan", plan);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const signOut = () => {
    console.log("Signing out");
    setIsAuthenticated(false);
    setUserPlan(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userPlan");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const plan = localStorage.getItem("userPlan");
    if (token && plan) {
      setIsAuthenticated(true);
      setUserPlan(plan);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userPlan, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

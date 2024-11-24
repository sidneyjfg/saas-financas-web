import React, { createContext, useState, useEffect } from "react";
import { login, getCurrentUser, logout } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Função de login
  const signIn = async (email, password) => {
    const response = await login(email, password);
    setUser(response.user); // Atualiza o estado com o usuário logado
  };

  // Função de logout
  const signOut = () => {
    logout();
    setUser(null);
  };

  // Buscar o usuário atual ao carregar a aplicação
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        logout();
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";
import { initializeSocket, getSocket } from "../services/webSocket";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Armazena os dados completos do usuário

  const signIn = async (email, password) => {
    try {
      const response = await api.post("/users/login", { email, password });
      const { token, user } = response.data;

      setIsAuthenticated(true);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Inicializa o WebSocket com o userId
      if (user?.id) {
        console.log("🔌 Inicializando WebSocket após login para usuário:", user.id);
        initializeSocket(user);
      }
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

    // Desconecta o WebSocket ao sair
    const socket = getSocket();
    if (socket) {
      socket.disconnect();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUser(parsedUser);

      // Inicializa o WebSocket apenas se ainda não estiver inicializado
      if (!getSocket()) {
        initializeSocket(parsedUser);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

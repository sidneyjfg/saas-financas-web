import api from "./api";

export const login = async (email, password) => {
  

  try {
    const response = await api.post("/users/login", { email, password });
    
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const register = async (name, email, password, planId) => {
  const response = await api.post("/users/register", { name, email, password, planId });
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // Remova o plano ao deslogar
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me"); // Assumindo que o backend tenha um endpoint para retornar o usuário atual
  return response.data;
};

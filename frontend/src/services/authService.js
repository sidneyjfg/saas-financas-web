import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/users/login", { email, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    return response.data;
  }
};

export const register = async (name, email, password, planId) => {
  const response = await api.post("/users/register", { name, email, password, planId });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me"); // Assumindo que o backend tenha um endpoint para retornar o usuário atual
  return response.data;
};

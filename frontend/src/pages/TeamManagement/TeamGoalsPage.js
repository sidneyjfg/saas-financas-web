import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

export const TeamGoalsPage = ({ teamId }) => {
  const [activeTab, setActiveTab] = useState("goals"); // "goals" or "categories"
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const goalsResponse = await api.get(`/teams/goals`);
        setGoals(goalsResponse.data);
      } catch (error) {
        console.error("Erro ao carregar metas:", error);
        showErrorToast("Erro ao carregar metas do time.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [teamId]);


  const fetchCategories = async () => {
    if (categories.length > 0) return; // Evita carregamento desnecessário

    try {
      setLoading(true); // Opcional: exibir um indicador de carregamento
      const categoriesResponse = await api.get(`/teams/categories`);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      showErrorToast("Erro ao carregar categorias do time.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "categories") fetchCategories();
  };

  const addGoal = async () => {
    if (!newGoal) {
      showErrorToast("Digite uma meta válida.");
      return;
    }
    try {
      const response = await api.post(`/teams/goals`, { description: newGoal });
      setGoals([...goals, response.data]);
      setNewGoal("");
      showSuccessToast("Meta adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar meta:", error);
      showErrorToast("Erro ao adicionar meta.");
    }
  };

  const addCategory = async () => {
    if (!newCategory) {
      showErrorToast("Digite uma categoria válida.");
      return;
    }
    try {
      const response = await api.post(`/teams/categories`, { name: newCategory });
      setCategories([...categories, response.data]);
      setNewCategory("");
      showSuccessToast("Categoria adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      showErrorToast("Erro ao adicionar categoria.");
    }
  };

  if (loading) {
    return <div>Carregando dados...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-teal-600 text-center mb-6">
        Gerenciamento do Time
      </h1>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === "goals"
              ? "bg-teal-600 text-white"
              : "bg-gray-200 text-gray-600"
            }`}
          onClick={() => handleTabChange("goals")}
        >
          Metas
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === "categories"
              ? "bg-teal-600 text-white"
              : "bg-gray-200 text-gray-600"
            }`}
          onClick={() => handleTabChange("categories")}
        >
          Categorias
        </button>
      </div>


      {/* Goals Tab */}
      {activeTab === "goals" && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-teal-600 mb-4">Metas do Time</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              className="border rounded-lg p-2 w-full"
              placeholder="Nova Meta"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
            />
            <button
              onClick={addGoal}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Adicionar Meta
            </button>
          </div>
          <ul className="mt-6 space-y-4">
            {goals.map((goal) => (
              <li key={goal.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <p className="text-gray-700">{goal.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-teal-600 mb-4">
            Categorias do Time
          </h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              className="border rounded-lg p-2 w-full"
              placeholder="Nova Categoria"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              onClick={addCategory}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Adicionar Categoria
            </button>
          </div>
          <ul className="mt-6 space-y-4">
            {categories.map((category) => (
              <li key={category.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <p className="text-gray-700">{category.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const CATEGORY_LIMITS = {
  Basic: 5, // Limite de categorias para o plano básico
  Premium: Infinity, // Sem limite para o plano Premium
};

export const CategoriesPage = () => {
  const { userPlan } = useAuth(); // Recupera o plano do usuário
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "",
    keywords: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const remainingCategories = CATEGORY_LIMITS[userPlan] - categories.length;

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const endpoint =
          userPlan === "Basic" ? "/categories/basic" : "/categories/premium";
        const response = await api.get(endpoint);
        console.log("Categorias carregadas:", response.data);
  
        // Atualiza o estado das categorias
        setCategories(
          response.data.map((category) => ({
            ...category,
            keywords: category.keywords ? category.keywords.join(", ") : "", // Certifique-se de que 'keywords' está sendo tratado
          }))
        );
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategories();
  }, [userPlan]);
  

  // Create or Update Category
  const handleSaveCategory = async () => {
    if (!newCategory.name.trim()) {
      alert("O nome da categoria é obrigatório.");
      return;
    }

    if (!newCategory.keywords.trim()) {
      alert("Adicione ao menos uma palavra-chave.");
      return;
    }

    // Definir cor padrão como preta (#000000) caso não seja fornecida
    const categoryData = {
      ...newCategory,
      color: newCategory.color || "#000000", // Cor padrão
      keywords: newCategory.keywords.split(",").map((keyword) => keyword.trim()), // Converte para array
    };

    try {
      if (editingCategory) {
        // Atualizar categoria existente
        await api.put(`/categories/${editingCategory.id}`, categoryData);
      } else {
        // Criar nova categoria
        console.log("Criando categoria:", categoryData);
        await api.post("/categories", categoryData);
      }

      // Atualizar lista de categorias
      const endpoint =
        userPlan === "Basic" ? "/categories/basic" : "/categories/premium";
      const response = await api.get(endpoint);
      setCategories(
        response.data.map((category) => ({
          ...category,
          keywords: category.keywords ? category.keywords.join(", ") : "", // Converte array para string
        }))
      );

      // Resetar o formulário
      setNewCategory({ name: "", color: "", keywords: "" });
      setEditingCategory(null);
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  };

  // Edit Category
  const handleEditCategory = (category) => {
    setNewCategory({
      name: category.name,
      color: category.color,
      keywords: category.keywords, // Já está formatado como string
    });
    setEditingCategory(category);
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  if (loading) {
    return <p className="text-center mt-6 text-gray-500">Carregando...</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-600 text-center mb-8">
          Gerenciamento de Categorias ({userPlan} Plan)
        </h1>
        <p>
          Você tem {remainingCategories > 0 ? remainingCategories : 0} categorias restantes no plano {userPlan}.
        </p>
        {/* Form */}
        <div className="bg-white p-6 shadow-lg rounded-lg mb-10">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            {editingCategory ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              className="border-gray-300 border rounded-lg p-2"
              placeholder="Nome da categoria"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />
            <input
              type="color"
              className="w-16 h-10 border-gray-300 border rounded-lg"
              value={newCategory.color}
              onChange={(e) =>
                setNewCategory({ ...newCategory, color: e.target.value })
              }
            />
            <textarea
              className="border-gray-300 border rounded-lg p-2"
              placeholder="Palavras-chave (separadas por vírgula)"
              value={newCategory.keywords}
              onChange={(e) =>
                setNewCategory({ ...newCategory, keywords: e.target.value })
              }
            />
            <button
              onClick={handleSaveCategory}
              className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300"
            >
              {editingCategory ? "Atualizar" : "Adicionar"}
            </button>
          </div>
        </div>

        {/* Categories List */}
        {categories.length === 0 ? (
          <p className="text-center mt-6 text-gray-500">
            Nenhuma categoria encontrada. Crie sua primeira categoria acima!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white p-4 shadow-lg rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-gray-700 font-bold">
                      {category.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Palavras-chave: {category.keywords}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="px-3 py-1 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all duration-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="px-3 py-1 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

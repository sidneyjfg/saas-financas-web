import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from "../contexts/AuthContext";
import { formatDate, formatCurrency } from "../utils/index"

export const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const { userPlan } = useAuth(); // Recupera o plano do usuário
  const [categories, setCategories] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    categoryId: '',
  });
  const [editingGoalId, setEditingGoalId] = useState(null); // ID da meta que está sendo editada
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Carrega metas
        const goalsResponse = await api.get('/goals');
        setGoals(goalsResponse.data);

        // Carrega categorias para vincular às metas
        const endpoint =
          userPlan === "Basic" ? "/categories/basic" : "/categories/premium"; // Diferencia endpoint por plano
        const categoriesResponse = await api.get(endpoint);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userPlan]);

  const handleSaveGoal = async () => {
    try {
      if (!newGoal.name || !newGoal.targetAmount || isNaN(newGoal.targetAmount)) {
        alert('Preencha todos os campos obrigatórios e insira um valor válido.');
        return;
      }
  
      let categoryId = newGoal.categoryId;
  
      // Criar uma nova categoria automaticamente, se necessário
      if (!categoryId) {
        const categoryResponse = await api.post('/categories', {
          name: `Meta: ${newGoal.name}`,
          color: '#4CAF50', // Cor padrão para categorias de metas
        });
        categoryId = categoryResponse.data.id;
      }
  
      // Salvar ou atualizar a meta
      const goalData = {
        ...newGoal,
        categoryId,
      };
  
      if (editingGoalId) {
        // Atualizar meta existente
        await api.put(`/goals/${editingGoalId}`, goalData);
      } else {
        // Criar nova meta
        await api.post('/goals', goalData);
      }
  
      // Atualizar a lista de metas
      const response = await api.get('/goals');
      setGoals(response.data);
  
      // Resetar o formulário
      setNewGoal({ name: '', targetAmount: '', deadline: '', categoryId: '' });
      setEditingGoalId(null); // Encerrar modo de edição
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      
      // Verificar se há mensagem do backend
      const errorMessage = error.response?.data?.message || 'Erro inesperado. Tente novamente.';
      alert(errorMessage); // Exibir mensagem do backend ao usuário
    }
  };
  

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      try {
        await api.delete(`/goals/${id}`);

        // Atualizar a lista de metas após a exclusão
        const response = await api.get('/goals');
        setGoals(response.data);
      } catch (error) {
        console.error('Erro ao excluir meta:', error);
        alert('Erro ao excluir meta. Tente novamente.');
      }
    }
  };

  const handleEditGoal = (goal) => {
    console.log(goal.deadline);
    setNewGoal({
      name: goal.name,
      targetAmount: goal.targetAmount,
      deadline: formatDate(goal.deadline),
      categoryId: goal.categoryId,
    });
    setEditingGoalId(goal.id); // Define a meta que está sendo editada
  };
  const handleCancelEdit = () => {
    setNewGoal({ name: '', targetAmount: '', deadline: '', categoryId: '' });
    setEditingGoalId(null); // Sai do modo de edição
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-600 text-center mb-6">
          Planejamento de Metas
        </h1>

        {/* Formulário de Nova Meta */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">{editingGoalId ? 'Editar Meta' : 'Nova Meta'}</h2>
          <input
            type="text"
            className="border rounded-lg p-2 w-full mb-4"
            placeholder="Nome da meta"
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
          />
          <input
            type="number"
            className="border rounded-lg p-2 w-full mb-4"
            placeholder="Valor alvo"
            value={newGoal.targetAmount}
            onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
          />
          <input
            type="date"
            className="border rounded-lg p-2 w-full mb-4"
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
          />
          <select
            className="border rounded-lg p-2 w-full mb-4"
            value={newGoal.categoryId}
            onChange={(e) => setNewGoal({ ...newGoal, categoryId: e.target.value })}
          >
            <option value="">Criar nova categoria automaticamente</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="flex justify-between">
            <button
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
              onClick={handleSaveGoal}
            >
              {editingGoalId ? 'Atualizar Meta' : 'Salvar Meta'}
            </button>
            {editingGoalId && (
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
                onClick={handleCancelEdit}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
        {/* Lista de Metas */}
        {loading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progressPercentage = Math.min(
                (goal.progress / goal.targetAmount) * 100,
                100
              );

              return (
                <div key={goal.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold text-teal-600">{goal.name}</h3>
                  <p className="text-gray-700">
                    Categoria: {categories.find((cat) => cat.id === goal.categoryId)?.name || 'Sem Categoria'}
                  </p>
                  <p className="text-gray-700">
                    Alvo: {formatCurrency(goal.targetAmount)}
                  </p>
                  <p className="text-gray-500">
                    Prazo: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                  <div className="mt-4">
                    <div className="relative w-full h-4 bg-gray-200 rounded">
                      <div
                        className="absolute top-0 left-0 h-4 bg-teal-600 rounded"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Progresso: {formatCurrency(goal.progress || 0)} / {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from "../contexts/AuthContext";

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
      if (!newGoal.name || !newGoal.targetAmount) {
        alert('Preencha todos os campos obrigatórios.');
        return;
      }

      let categoryId = newGoal.categoryId;

      // Se nenhuma categoria for escolhida, crie uma nova
      if (!categoryId) {
        const categoryResponse = await api.post('/categories', {
          name: `Meta: ${newGoal.name}`,
          color: '#4CAF50', // Cor padrão
        });
        categoryId = categoryResponse.data.id;
      }

      // Salve a meta vinculada à categoria
      await api.post('/goals', {
        ...newGoal,
        categoryId,
      });

      // Atualize a lista de metas
      const response = await api.get('/goals');
      setGoals(response.data);

      // Limpe o formulário
      setNewGoal({ name: '', targetAmount: '', deadline: '', categoryId: '' });
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    }
  };


  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-600 text-center mb-6">
          Planejamento de Metas
        </h1>

        {/* Formulário de Nova Meta */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Nova Meta</h2>
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

          <button
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
            onClick={handleSaveGoal}
          >
            Salvar Meta
          </button>
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

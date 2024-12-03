import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

export const TeamGoalsPage = ({ teamId }) => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await api.get(`/teams/${teamId}/goals`);
        setGoals(response.data);
      } catch (error) {
        console.error("Erro ao carregar metas:", error);
        showErrorToast("Erro ao carregar metas.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [teamId]);

  const addGoal = async () => {
    if (!newGoal) {
      showErrorToast("Digite uma meta válida.");
      return;
    }
    try {
      const response = await api.post(`/teams/${teamId}/goals`, { goal: newGoal });
      setGoals([...goals, response.data]);
      setNewGoal("");
      showSuccessToast("Meta adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar meta:", error);
      showErrorToast("Erro ao adicionar meta.");
    }
  };

  if (loading) {
    return <div>Carregando metas...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-teal-600 text-center mb-6">
        Metas do Time
      </h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <input
          type="text"
          className="border rounded-lg p-2 w-full mb-4"
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

      <ul className="space-y-4">
        {goals.map((goal) => (
          <li key={goal.id} className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-600">{goal.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

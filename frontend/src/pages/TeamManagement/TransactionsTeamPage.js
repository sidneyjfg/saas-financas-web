import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { showErrorToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

export const TransactionsTeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get("/teams");
        setTeams(response.data);
      } catch (error) {
        console.error("Erro ao carregar equipes:", error);
        showErrorToast("Erro ao carregar equipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return <div>Carregando equipes...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-teal-600 text-center mb-6">
        Lista de Equipes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold text-teal-600">{team.name}</h2>
            <p>Total de Transações: {team.transactionCount}</p>
            <p>Saldo Atual: R$ {team.currentBalance}</p>
            <button
              onClick={() => navigate(`/team-management/${team.id}/transactions`)}
              className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            >
              Ver Transações
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

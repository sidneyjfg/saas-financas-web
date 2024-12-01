import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { showErrorToast } from "../../utils/toast";
import { formatDate } from "../../utils/formatDate"

export const OverviewPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await api.get("/teams/overview"); // Endpoint para visão geral
        console.log(response.data);
        setTeams(response.data);
      } catch (error) {
        console.error("Erro ao carregar a visão geral:", error);
        showErrorToast("Erro ao carregar a visão geral.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-600 text-center mb-6">
          Visão Geral dos Times
        </h1>
        {teams.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum time encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-teal-600">{team.name}</h2>
                <p className="text-sm text-gray-500">Membros: {team.totalMembers}</p>
                <p className="text-sm text-gray-500">
                  Última atualização:{" "}
                  {formatDate(team.updatedAt)} {/* Formatação */}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
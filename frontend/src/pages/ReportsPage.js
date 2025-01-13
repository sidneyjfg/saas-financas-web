import React, { useEffect, useState, useCallback } from "react";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { useAuth } from "../contexts/AuthContext";
import { useReport } from "../contexts/ReportContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PremiumReports from "../components/PremiumReports";
import BasicReports from "../components/BasicReports";
import { formatCurrency } from "../utils/index";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registra componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const ReportsPage = () => {
  const { shouldReload, resetReload } = useReport(); // Contexto para atualização
  const { user } = useAuth(); // Obtém o usuário do contexto
  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]); // Inicializa como array vazio
  const [goals, setGoals] = useState([]); // Inicializa como array vazio
  const [loading, setLoading] = useState(true);

  const reloadReportData = useCallback(async () => {
    try {
      setLoading(true);
      const reportEndpoint =
        user?.plan?.name === "Basic" ? "/transactions/monthly" : "/transactions/premium/summary";
      const reportResponse = await api.get(reportEndpoint);

      const reportArray = Array.isArray(reportResponse.data) ? reportResponse.data : [];
      setReportData(reportArray);

      const goalsResponse = await api.get("/goals");
      const goalsArray = Array.isArray(goalsResponse.data) ? goalsResponse.data : [];
      setGoals(goalsArray);
    } catch (error) {
      console.error("Erro ao carregar dados do relatório:", error);
      showErrorToast("Erro ao carregar relatórios! Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [user?.plan.name]); // Memoriza a função com base no plano do usuário

  useEffect(() => {
    if (!user?.plan?.name) {
      navigate("/signin");
    }
  }, [user?.plan?.name, navigate]);

  // Recarregar dados ao montar o componente
  useEffect(() => {
    reloadReportData();
  }, [reloadReportData]);

  // Recarregar dados quando o estado `shouldReload` mudar
  useEffect(() => {
    if (shouldReload) {
      reloadReportData();
      resetReload();
    }
  }, [shouldReload, reloadReportData, resetReload]);

  const handleExportCSV = async () => {
    try {
      const endpoint =
        user?.plan?.name === "Basic" ? "/transactions/basic/export" : "/transactions/premium/export";
      const response = await api.get(endpoint, { responseType: "blob" });
      showSuccessToast("Transações exportadas com sucesso!");
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      showErrorToast("Erro ao exportar dados.");
    }
  };

  if (loading) {
    return <p className="text-center mt-6 text-gray-500">Carregando...</p>;
  }

  if (!reportData.length) {
    return <p className="text-center mt-6 text-gray-500">Nenhum dado disponível.</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col md:flex-row w-full max-w-8xl bg-white rounded-lg shadow-lg p-6 gap-6">
        {/* Coluna de Relatórios */}
        <div className="flex-1">
          {user?.plan?.name === "Premium" ? (
            <PremiumReports data={reportData} goalsData={goals} />
          ) : (
            <BasicReports data={reportData} goalsData={goals} />
          )}
          <button
            onClick={handleExportCSV}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-md transition duration-200 mt-4"
          >
            Exportar para CSV
          </button>
        </div>

        {/* Coluna de Metas */}
        <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-inner">
          <h2 className="text-xl font-bold text-teal-600 mb-4">Metas</h2>
          {goals.length === 0 ? (
            <p className="text-gray-500">Nenhuma meta encontrada.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {goals
                .filter((goal) => goal && goal.targetAmount && goal.name) // Garante que as metas sejam válidas
                .map((goal) => {
                  const progressPercentage = Math.min(
                    (goal.progress / goal.targetAmount) * 100,
                    100
                  );

                  return (
                    <div key={goal.id} className="bg-white p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-bold text-teal-600">{goal.name}</h3>
                      <p className="text-gray-700">
                        Alvo: {formatCurrency(goal.targetAmount)}
                      </p>
                      <p className="text-gray-500">
                        Prazo: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "Sem prazo definido"}
                      </p>
                      <div className="mt-4">
                        <div className="relative w-full h-4 bg-gray-200 rounded">
                          <div
                            className="absolute top-0 left-0 h-4 bg-teal-600 rounded"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Progresso: {formatCurrency(goal.progress || 0)} / {formatCurrency(goal.targetAmount || 0)}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

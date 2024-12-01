import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { showErrorToast } from "../../utils/toast";

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await api.get("/teams/audit-logs");
        setLogs(response.data);
      } catch (error) {
        console.error("Erro ao carregar logs de auditoria:", error.message);
        showErrorToast("Erro ao carregar logs de auditoria.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  if (loading) {
    return <div>Carregando logs de auditoria...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-600 text-center mb-6">
          Logs de Auditoria
        </h1>
        {logs.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum log de auditoria encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li key={log.id} className="bg-white p-4 rounded-lg shadow-md">
                <p><strong>Ação:</strong> {log.action}</p>
                <p><strong>Data:</strong> {new Date(log.createdAt).toLocaleString()}</p>
                <p><strong>Time:</strong> {log.team?.name || "Não especificado"}</p>
                <p><strong>Detalhes:</strong> {JSON.stringify(log.details, null, 2)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

import React from "react";
import { useParams } from "react-router-dom";

export const AuditLogsPage = () => {
  const { teamId } = useParams(); // Captura o ID do time da URL

  return (
    <div>
      <h2 className="text-2xl font-bold">Logs de Auditoria do Time {teamId}</h2>
      <p>Aqui você pode visualizar as atividades realizadas no time.</p>
    </div>
  );
};

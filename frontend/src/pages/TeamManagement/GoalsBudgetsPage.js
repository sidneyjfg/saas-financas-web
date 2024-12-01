import React from "react";
import { useParams } from "react-router-dom";

export const GoalsBudgetsPage = () => {
  const { teamId } = useParams(); // Captura o ID do time da URL

  return (
    <div>
      <h2 className="text-2xl font-bold">Metas e Orçamentos do Time {teamId}</h2>
      <p>Aqui você poderá gerenciar metas e orçamentos do time.</p>
    </div>
  );
};


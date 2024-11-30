import React from "react";
import { useParams } from "react-router-dom";

export const OverviewPage = () => {
  const { teamId } = useParams(); // Captura o ID do time da URL

  return (
    <div>
      <h2 className="text-2xl font-bold">Visão Geral do Time {teamId}</h2>
      <p>Aqui você pode ver um resumo das atividades do time.</p>
    </div>
  );
};



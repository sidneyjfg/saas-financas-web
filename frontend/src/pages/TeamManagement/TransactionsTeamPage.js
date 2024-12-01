import React from "react";
import { useParams } from "react-router-dom";

export const TransactionsTeamPage = () => {
  const { teamId } = useParams(); // Captura o ID do time da URL

  return (
    <div>
      <h2 className="text-2xl font-bold">Transações do Time </h2>
      <p>Aqui você poderá visualizar e gerenciar as transações do time.</p>
    </div>
  );
};


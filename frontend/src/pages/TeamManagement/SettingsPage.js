import React from "react";
import { useParams } from "react-router-dom";

export const SettingsPage = () => {
  const { teamId } = useParams(); // Captura o ID do time da URL

  return (
    <div>
      <h2 className="text-2xl font-bold">Configurações do Time {teamId}</h2>
      <p>Aqui você poderá alterar as configurações do time.</p>
    </div>
  );
};
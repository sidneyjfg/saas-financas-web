import React from "react";
import { Link } from "react-router-dom";

export const TeamDetailsPage = ({ team }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-teal-600 text-center mb-6">
        Detalhes do Time: {team.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to={`/team-management/${team.id}/transactions`}
          className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          <h2 className="text-xl font-bold text-teal-600">Transações</h2>
          <p>Gerencie e visualize as transações financeiras do time.</p>
        </Link>

        <Link
          to={`/team-management/${team.id}/goals`}
          className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          <h2 className="text-xl font-bold text-teal-600">Metas</h2>
          <p>Defina e acompanhe as metas financeiras do time.</p>
        </Link>

        <Link
          to={`/team-management/${team.id}/categories`}
          className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          <h2 className="text-xl font-bold text-teal-600">Categorias</h2>
          <p>Organize as transações em categorias específicas.</p>
        </Link>

        <Link
          to={`/team-management/${team.id}/members`}
          className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          <h2 className="text-xl font-bold text-teal-600">Membros</h2>
          <p>Gerencie os membros do time e seus papéis.</p>
        </Link>
      </div>
    </div>
  );
};

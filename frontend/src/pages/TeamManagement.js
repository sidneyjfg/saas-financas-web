import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { showErrorToast, showSuccessToast, showInfoToast } from "../utils/toast";
import { Dropdown } from "../components/Dropdown";
import { showConfirmDialog } from "../utils/confirmDialog";

export const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState({});
  const [expandedTeamIds, setExpandedTeamIds] = useState([]);
  const [newMember, setNewMember] = useState({ email: "", role: "member" });
  const [currentUserEmail, setCurrentUserEmail] = useState([]);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/users/me"); // Endpoint para obter o usuário atual
      const email = response.data.email;

      return email;
    } catch (error) {
      console.error("Erro ao obter o usuário logado:", error);
    }
  };

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
    const loadUser = async () => {
      const email = await fetchCurrentUser();
      if (email) {
        setCurrentUserEmail(email); // Use o setter corretamente
      }
    };
    loadUser();
    fetchTeams();
  }, []);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      showErrorToast("Digite um nome válido para a equipe.");
      return;
    }

    try {
      const response = await api.post("/teams", { name: newTeamName });
      setTeams((prev) => [...prev, response.data]);
      setNewTeamName("");
      setIsModalOpen(false);
      showSuccessToast("Equipe criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar equipe:", error);
      showErrorToast("Erro ao criar equipe.");
    }
  };

  const toggleTeamExpansion = async (teamId) => {
    if (expandedTeamIds.includes(teamId)) {
      setExpandedTeamIds(expandedTeamIds.filter((id) => id !== teamId));
    } else {
      setExpandedTeamIds([...expandedTeamIds, teamId]);

      try {
        const response = await api.get(`/teams/${teamId}/members`);
        setTeamMembers((prev) => ({ ...prev, [teamId]: response.data }));
        showInfoToast("Membros carregados com sucesso!");
      } catch (error) {
        console.error("Erro ao carregar membros do time:", error);
        showErrorToast("Erro ao carregar os membros do time.");
      }
    }
  };

  const addMember = async (teamId) => {
    if (!newMember.email || !newMember.role) {
      showErrorToast("Preencha os campos de e-mail e papel corretamente.");
      return;
    }

    try {
      const response = await api.post(`/teams/${teamId}/members`, newMember);
      setTeamMembers((prev) => ({
        ...prev,
        [teamId]: [...(prev[teamId] || []), response.data],
      }));
      setNewMember({ email: "", role: "member" });
      showSuccessToast("Membro adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar membro:", error);
      showErrorToast("Erro ao adicionar o membro.");
    }
  };

  const removeMember = async (teamId, memberId, isCurrentUser) => {
    const currentTeamMembers = teamMembers[teamId] || [];
    const admins = currentTeamMembers.filter((member) => member.role === "admin");

    if (isCurrentUser) {
      if (admins.length <= 1) {
        showErrorToast(
          "Você não pode sair do time enquanto for o único administrador."
        );
        return;
      }
    }

    try {
      await api.delete(`/teams/${teamId}/members/${memberId}`);
      setTeamMembers((prev) => ({
        ...prev,
        [teamId]: prev[teamId].filter((member) => member.id !== memberId),
      }));

      if (isCurrentUser) {
        setTeams((prev) => prev.filter((team) => team.id !== teamId)); // Remove o time da lista se o usuário sair
        showSuccessToast("Você saiu do time com sucesso!");
      } else {
        showSuccessToast("Membro removido com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao remover membro:", error);
      showErrorToast("Erro ao remover o membro. Tente novamente.");
    }
  };

  const removeTeam = async (teamId) => {

    try {
      await api.delete(`/teams/${teamId}`);
      setTeams((prev) => prev.filter((team) => team.id !== teamId));
      setExpandedTeamIds((prev) => prev.filter((id) => id !== teamId));
      showSuccessToast("Time removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover time:", error);
      showErrorToast("Erro ao remover o time. Tente novamente.");
    }

  };

  const handleViewTransactions = (team) => {
    setSelectedTeam(team); // Armazena o time no contexto
    console.log(team);
    navigate("/team-management/transactions", { state: { team } }); // Passa o time no estado da navegação
  };

  const openDetailsModal = (team) => {
    setSelectedTeam(team);
    setIsDetailsModalOpen(true);
  };

  if (loading) {
    return <div>Carregando equipes...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-teal-600 text-center mb-6">
        Gerenciamento de Equipes
      </h1>

      {/* Modal para Criar Equipe */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-teal-600 mb-4">
              Criar Nova Equipe
            </h2>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Nome da equipe"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTeam}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Equipes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition ${expandedTeamIds.includes(team.id) ? "ring-2 ring-teal-600" : ""
              }`}
          >
            {/* Cabeçalho do Card */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleTeamExpansion(team.id)}
            >
              <div>
                <h2 className="text-xl font-bold text-teal-600">{team.name}</h2>
                <p className="text-gray-600">Transações: {team.transactionCount || 0}</p>
                <p className="text-gray-600">Saldo Atual: R$ {team.currentBalance || 0}</p>
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 text-teal-600 transform transition-transform ${expandedTeamIds.includes(team.id) ? "rotate-180" : ""
                    }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707A1 1 0 014.293 8.293l5-5A1 1 0 0110 3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Botões do Card */}
            <div className="flex justify-between mt-4 gap-4">
              <button
                onClick={() => openDetailsModal(team)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Detalhes
              </button>
              <button onClick={() => handleViewTransactions(team)}

                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Ver Transações
              </button>
              <button
                onClick={() =>
                  showConfirmDialog({
                    title: "Excluir Time",
                    message: "Tem certeza que deseja excluir este time?",
                    onConfirm: () => removeTeam(team.id),
                  })
                }
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Excluir Time
              </button>
            </div>
            {/* Modal para Detalhes da Equipe */}
            {isDetailsModalOpen && selectedTeam && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold text-teal-600 mb-4">Detalhes da Equipe</h2>
                  <p>Nome: {selectedTeam.name}</p>
                  <p>Total de Membros: {teamMembers[selectedTeam.id]?.length || 0}</p>
                  <button
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
            {/* Adicionar Membro e Lista de Membros */}
            {expandedTeamIds.includes(team.id) && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  Adicionar Membro
                </h3>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="E-mail do membro"
                  className="border border-gray-300 rounded-lg p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <Dropdown
                  options={[
                    { value: "member", label: "Membro" },
                    { value: "admin", label: "Administrador" },
                  ]}
                  value={newMember.role}
                  onChange={(role) =>
                    setNewMember((prev) => ({ ...prev, role }))
                  }
                />
                <button
                  onClick={() => addMember(team.id)}
                  className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  Adicionar
                </button>

                {/* Lista de Membros */}
                <h3 className="text-lg font-bold text-gray-700 mt-4">Membros</h3>
                <ul className="space-y-2">
                  {teamMembers[team.id]?.map((member) => (
                    <li
                      key={member.id}
                      className="flex justify-between items-center text-gray-600"
                    >
                      <span>
                        {member.email} ({member.role})
                      </span>
                      {member.email === currentUserEmail ? (
                        <button
                          onClick={() => removeMember(team.id, member.id, true)}
                          className="text-blue-600 hover:underline"
                        >
                          Sair
                        </button>
                      ) : (
                        <button
                          onClick={() => removeMember(team.id, member.id, false)}
                          className="text-red-600 hover:underline"
                        >
                          Remover
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Botão Flutuante para Adicionar Nova Equipe */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-teal-600 text-white p-5 rounded-full shadow-lg hover:bg-teal-700 hover:shadow-xl transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};

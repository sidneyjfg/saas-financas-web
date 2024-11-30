import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Dropdown } from "../components/Dropdown";
import { showErrorToast, showSuccessToast, showInfoToast } from "../utils/toast";

export const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [expandedTeamIds, setExpandedTeamIds] = useState([]); // IDs dos times expandidos
  const [teamMembers, setTeamMembers] = useState({});
  const [newTeamName, setNewTeamName] = useState("");
  const [newMember, setNewMember] = useState({ email: "", role: "member" });
  const [loading, setLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState([]);

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
        setLoading(true);
        const response = await api.get("/teams");
        setTeams(response.data);
      } catch (error) {
        console.error("Erro ao carregar times:", error);
        showErrorToast("Erro ao carregar a lista de times. Tente novamente.");
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

  const toggleTeamExpansion = async (teamId) => {
    if (expandedTeamIds.includes(teamId)) {
      setExpandedTeamIds(expandedTeamIds.filter((id) => id !== teamId));
    } else {
      setExpandedTeamIds([...expandedTeamIds, teamId]);

      if (!teamMembers[teamId]) {
        try {
          const response = await api.get(`/teams/${teamId}/members`);
          setTeamMembers((prev) => ({ ...prev, [teamId]: response.data }));
          showInfoToast("Membros carregados com sucesso!");
        } catch (error) {
          console.error("Erro ao carregar membros do time:", error);
          showErrorToast("Erro ao carregar os membros do time.");
        }
      }
    }
  };


  const createTeam = async () => {
    if (!newTeamName) {
      showErrorToast("Digite um nome válido para o time.");
      return;
    }

    try {
      const response = await api.post("/teams", { name: newTeamName });
      setTeams([...teams, response.data]);
      setNewTeamName("");
      showSuccessToast("Time criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar time:", error);
      showErrorToast("Erro ao criar o time. Tente novamente.");
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
      const errorMessage =
        error.response?.data?.error || "Erro ao importar o arquivo.";
      console.error("Erro ao adicionar membro:", error);
      showErrorToast(`Erro ao adicionar o membro.\n${errorMessage} Tente novamente.`);
    }
  };

  const removeMember = async (teamId, memberId, memberEmail, isCurrentUser) => {
    const currentTeamMembers = teamMembers[teamId] || [];
    const admins = currentTeamMembers.filter((member) => member.role === "admin");

    if (isCurrentUser) {
      if (admins.length <= 1) {
        showErrorToast("Você não pode sair do time enquanto for o único administrador.");
        return;
      }
    }

    try {
      await api.delete(`/teams/${teamId}/members/${memberId}`);
      setTeamMembers((prev) => ({
        ...prev,
        [teamId]: prev[teamId].filter((member) => member.id !== memberId),
      }));
      showSuccessToast(
        isCurrentUser
          ? "Você saiu do time com sucesso!"
          : `Membro ${memberEmail} removido com sucesso!`
      );
    } catch (error) {
      console.error("Erro ao remover membro:", error);
      showErrorToast("Erro ao remover o membro. Tente novamente.");
    }
  };

  const removeTeam = async (teamId) => {
    if (
      window.confirm(
        "Tem certeza que deseja remover este time? Todos os membros serão excluídos."
      )
    ) {
      try {
        await api.delete(`/teams/${teamId}`);
        setTeams(teams.filter((team) => team.id !== teamId));
        setExpandedTeamIds(expandedTeamIds.filter((id) => id !== teamId));
        showSuccessToast("Time removido com sucesso!");
      } catch (error) {
        console.error("Erro ao remover time:", error);
        showErrorToast("Erro ao remover o time. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-600 text-center mb-6">
          Gerenciamento de Times
        </h1>

        {/* Criar Novo Time */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Criar Novo Time</h2>
          <input
            type="text"
            className="border rounded-lg p-2 w-full mb-4"
            placeholder="Nome do time"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
          <button
            onClick={createTeam}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
          >
            Criar Time
          </button>
        </div>

        {/* Lista de Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p className="text-center text-gray-500">Carregando...</p>
          ) : (
            teams.map((team) => (
              <div key={team.id} className="bg-white p-4 rounded-lg shadow-md">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleTeamExpansion(team.id)}
                >
                  <h3 className="text-lg font-bold text-teal-600">{team.name}</h3>
                  <span
                    className={`transition-transform transform ${expandedTeamIds.includes(team.id) ? "rotate-180" : ""
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-teal-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </span>
                </div>

                {expandedTeamIds.includes(team.id) && (
                  <div className="mt-4">
                    {/* Formulário para adicionar membro */}
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                      <h4 className="text-sm font-bold mb-2">Adicionar Membro</h4>
                      <input
                        type="email"
                        className="border rounded-lg p-2 w-full mb-2"
                        placeholder="E-mail"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      />
                      <Dropdown
                        options={[
                          { value: "member", label: "Membro" },
                          { value: "admin", label: "Administrador" },
                        ]}
                        value={newMember.role}
                        onChange={(role) => setNewMember({ ...newMember, role })}
                        placeholder="Selecione o Papel"
                      />
                      <button
                        onClick={() => addMember(team.id)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-teal-700 transition-all"
                      >
                        Adicionar
                      </button>
                    </div>

                    {/* Lista de membros */}
                    <div>
                      <h4 className="text-sm font-bold mb-2">Membros</h4>
                      {teamMembers[team.id]?.map((member) => (
                        <div
                          key={member.id}
                          className="bg-white p-2 rounded-lg shadow-sm flex justify-between items-center mb-2"
                        >
                          <div>
                            <p className="text-sm font-bold">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                          <button
                            onClick={() =>
                              removeMember(
                                team.id,
                                member.id,
                                member.email,
                                member.email === currentUserEmail
                              )
                            }
                            className={`${member.email === currentUserEmail
                              ? "text-blue-600 hover:underline"
                              : "text-red-600 hover:underline"
                              }`}
                          >
                            {member.email === currentUserEmail ? "Sair" : "Remover"}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Remover Time */}
                    <button
                      onClick={() => removeTeam(team.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-700 transition-all"
                    >
                      Remover Time
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

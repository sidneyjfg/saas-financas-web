const teamService = require("../services/teamService");

class TeamController {
    async createTeam(req, res) {
        const { name } = req.body;
        const ownerId = req.user.id; // Usuário autenticado é o dono

        try {
            const team = await teamService.createTeam(name, ownerId);
            return res.status(201).json(team);
        } catch (error) {
            console.error("Erro ao criar time:", error.message);
            return res.status(500).json({ error: "Erro ao criar time." });
        }
    }

    async getTeams(req, res) {
        const userId = req.user.id;

        try {
            const teams = await teamService.getTeams(userId);
            return res.status(200).json(teams);
        } catch (error) {
            console.error("Erro ao listar times:", error.message);
            return res.status(500).json({ error: "Erro ao listar times." });
        }
    }

    async getTeamById(req, res) {
        const { id } = req.params;

        try {
            const team = await teamService.getTeamById(id, req.user.id);
            if (!team) {
                return res.status(404).json({ error: "Time não encontrado." });
            }
            return res.status(200).json(team);
        } catch (error) {
            console.error("Erro ao obter detalhes do time:", error.message);
            return res.status(500).json({ error: "Erro ao obter detalhes do time." });
        }
    }

    async updateTeam(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        try {
            const updatedTeam = await teamService.updateTeam(id, name, req.user.id);
            if (!updatedTeam) {
                return res.status(404).json({ error: "Time não encontrado ou sem permissão para editar." });
            }
            return res.status(200).json(updatedTeam);
        } catch (error) {
            console.error("Erro ao atualizar time:", error.message);
            return res.status(500).json({ error: "Erro ao atualizar time." });
        }
    }

    async deleteTeam(req, res) {
        const { id } = req.params;

        try {
            const deleted = await teamService.deleteTeam(id, req.user.id);
            if (!deleted) {
                return res.status(404).json({ error: "Time não encontrado ou sem permissão para excluir." });
            }
            return res.status(200).json({ message: "Time excluído com sucesso." });
        } catch (error) {
            console.error("Erro ao excluir time:", error.message);
            return res.status(500).json({ error: "Erro ao excluir time." });
        }
    }

    async addMember(req, res) {
        const { id: teamId } = req.params; // ID do time
        const { email, role } = req.body; // Recebe o email e o role
        const adminId = req.user.id; // ID do usuário logado
      
        if (!email || !role) {
          return res.status(400).json({ error: "Os campos 'email' e 'role' são obrigatórios." });
        }
      
        try {
          // Chama o serviço para adicionar o membro
          const member = await teamService.addMemberByEmail(teamId, email, role, adminId);
      
          return res.status(201).json(member);
        } catch (error) {
          console.error("Erro ao adicionar membro:", error.message);
      
          if (error.message.includes("Você não tem permissão")) {
            return res.status(403).json({ error: error.message });
          } else if (error.message.includes("Usuário não encontrado")) {
            return res.status(404).json({ error: error.message });
          } else if (error.message.includes("Usuário já é membro")) {
            return res.status(400).json({ error: error.message });
          }
      
          return res.status(500).json({ error: "Erro ao adicionar membro." });
        }
      }
      
    



    async removeMember(req, res) {
        const { id: teamId, userId } = req.params;

        try {
            const removed = await teamService.removeMember(teamId, userId, req.user.id);
            if (!removed) {
                return res.status(404).json({ error: "Membro não encontrado ou sem permissão para remover." });
            }
            return res.status(200).json({ message: "Membro removido com sucesso." });
        } catch (error) {
            console.error("Erro ao remover membro:", error.message);
            return res.status(500).json({ error: "Erro ao remover membro." });
        }
    }
    async getMembersByTeam(req, res) {
        const { id: teamId } = req.params; // ID do time
        const userId = req.user.id; // ID do usuário autenticado
    
        try {
          // Chama o serviço para buscar os membros do time
          const members = await teamService.getMembersByTeam(teamId, userId);
          return res.status(200).json(members);
        } catch (error) {
          console.error("Erro ao listar membros do time:", error.message);
          return res.status(500).json({ error: "Erro ao listar membros do time." });
        }
      }
}

module.exports = new TeamController();

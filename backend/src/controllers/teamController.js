const teamService = require("../services/teamService");
const teamRepository = require("../repositories/teamRepository");
class TeamController {
    async createTeam(req, res) {
        const { name } = req.body;
        const ownerId = req.user.id; // Usuário autenticado

        try {
            const team = await teamService.createTeam(name, ownerId);
            return res.status(201).json({ teamId: team.id, name: team.name });
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
        const teamId = req.headers['x-team-id']; // Obtém o teamId dos headers
        const { email, role } = req.body;
        const adminId = req.user.id; // Usuário autenticado

        if (!teamId) {
            return res.status(400).json({ error: "ID do time não fornecido." });
        }

        if (!email || !role) {
            return res.status(400).json({ error: "Os campos 'email' e 'role' são obrigatórios." });
        }

        try {
            const member = await teamService.addMemberByEmail(teamId, email, role, adminId);
            return res.status(201).json(member);
        } catch (error) {
            console.error("Erro ao adicionar membro:", error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async removeMember(req, res) {
        console.log("PArams: ",req.params);
        const { userId } = req.params;
        const teamId = req.headers['x-team-id']; // Obtém o teamId dos headers
        console.log(userId,teamId, req.user.id);
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
        const teamId = req.headers['x-team-id'];
        const userId = req.user.id;

        console.log("TeamID recebido:", teamId);
        console.log("UserID autenticado:", userId);

        if (!teamId) {
            return res.status(400).json({ error: "ID do time não fornecido." });
        }

        try {
            const members = await teamService.getMembersByTeam(teamId, userId);
            return res.status(200).json(members);
        } catch (error) {
            console.error("Erro ao listar membros do time:", error.message);
            return res.status(403).json({ error: "Você não tem permissão para visualizar os membros deste time." });
        }
    }




    async getAuditLogs(req, res) {
        const userId = req.user.id;

        try {
            const logs = await teamService.getAuditLogs(userId);
            return res.status(200).json(logs);
        } catch (error) {
            console.error("Erro ao obter logs de auditoria:", error.message);
            return res.status(500).json({ error: "Erro ao obter logs de auditoria." });
        }
    }
    async getTeamTransactions(req, res) {
        const teamId = req.headers['x-team-id']; // Lê o ID do time dos headers
        const userId = req.user.id;
        console.log("TeamID: ", teamId);
        console.log("suerID: ", userId);
        if (!teamId) {
            return res.status(400).json({ error: "ID do time não fornecido." });
        }

        try {
            const { transactions, summary } = await teamService.getTeamTransactions(teamId, userId);
            return res.status(200).json({ transactions, summary });
        } catch (error) {
            console.error("Erro ao carregar transações:", error.message);
            return res.status(403).json({ error: "Você não tem permissão para visualizar as transações deste time." });
        }
    }

    async addTeamTransaction(req, res) {
        const teamId = req.headers["x-team-id"]; // Lê o ID do time do cabeçalho
        const { description, amount, type, date } = req.body;
        const userId = req.user.id;

        if (!teamId) {
            return res.status(400).json({ error: "ID do time não fornecido." });
        }

        if (!description || !amount || !type || !date) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }

        try {
            const transaction = await teamService.addTeamTransaction(teamId, {
                description,
                amount,
                type,
                date,
                createdBy: userId,
            });
            return res.status(201).json(transaction);
        } catch (error) {
            console.error("Erro ao adicionar transação:", error.message);
            return res.status(500).json({ error: "Erro ao adicionar transação." });
        }
    }


    async addTransaction(req, res) {
        const { teamId } = req.params;
        const { description, amount, type, date } = req.body;
        const userId = req.user.id;

        try {
            const transaction = await teamService.addTransaction({
                teamId,
                description,
                amount,
                type,
                date,
                createdBy: userId,
            });
            return res.status(201).json(transaction);
        } catch (error) {
            console.error("Erro ao adicionar transação:", error.message);
            return res.status(500).json({ error: "Erro ao adicionar transação." });
        }
    }

    // Listar transações de um time
    async getTransactions(req, res) {
        const { teamId } = req.user.id;
        console.log(teamId);
        try {
            const { transactions, summary } = await teamService.getTransactions(teamId);
            return res.status(200).json({ transactions, summary });
        } catch (error) {
            console.error("Erro ao obter transações:", error.message);
            return res.status(500).json({ error: "Erro ao obter transações." });
        }
    }
    async leaveTeam(req, res) {
        const userId = req.user.id; // ID do usuário autenticado
        const teamId = req.headers['x-team-id']; // Team ID passado no header

        try {
            // Verificar se o usuário é membro do time
            const member = await teamRepository.findMember(teamId, userId);
            if (!member) {
                return res.status(404).json({ error: "Você não pertence a este time." });
            }

            // Verifica se o usuário é admin/owner
            if (member.role === "admin" || member.role === "owner") {
                const adminCount = await teamRepository.countAdmins(teamId);

                // Impede a saída se for o único admin
                if (adminCount <= 1) {
                    return res.status(400).json({
                        error: "Você não pode sair do time enquanto for o único administrador.",
                    });
                }
            }

            // Realiza a remoção
            const left = await teamService.removeSelfFromTeam(teamId, userId);

            if (!left) {
                return res.status(404).json({ error: "Você não pertence a este time ou ele não existe." });
            }

            return res.status(200).json({ message: "Você saiu do time com sucesso." });
        } catch (error) {
            console.error("Erro ao sair do time:", error.message);
            return res.status(500).json({ error: "Erro ao sair do time." });
        }
    }

}

module.exports = new TeamController();

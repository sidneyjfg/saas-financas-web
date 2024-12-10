const { Team, TeamMember, User, AuditLog, TeamTransaction } = require("../models");

class TeamRepository {
    async createTeam(name, ownerId) {
        const team = await Team.create({ name });

        // Registra o criador como dono do time
        await TeamMember.create({
            teamId: team.id,
            userId: ownerId,
            role: "owner", // Garante que o criador seja o dono
        });


        // Verifica se este é o primeiro time do usuário
        const memberCount = await TeamMember.count({ where: { userId: ownerId } });
        if (memberCount === 1) {
            await User.update(
                { teamId: team.id },
                { where: { id: ownerId } }
            );
        }

        await this.logAction(ownerId, "create_team", { teamName: name }, team.id);
        return team;
    }



    async getTeams(userId) {
        const teams = await Team.findAll({
            attributes: ["id", "name", "createdAt", "updatedAt"],
            include: [
                {
                    model: TeamMember,
                    as: "members",
                    attributes: ["userId", "role"],
                    where: { userId },
                },
            ],
        });

        return teams.map((team) => ({
            id: team.id,
            name: team.name,
            role: team.members[0].role, // Role do usuário logado
            membersCount: team.members.length,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
        }));
    }


    async getTeamById(teamId, userId) {
        return await Team.findOne({
            where: { id: teamId },
            include: [
                {
                    model: TeamMember,
                    as: "members",
                    where: { userId },
                    required: true,
                },
            ],
        });
    }

    async updateTeam(teamId, name, userId) {
        const isOwner = await TeamMember.findOne({
            where: { teamId, userId, role: "owner" },
        });
        if (!isOwner) return null;

        const team = await Team.findByPk(teamId);
        if (!team) return null;

        team.name = name;
        await team.save();

        // Registrar log de atualização do time
        await this.logAction(userId, "update_team", {
            updatedName: name,
        }, teamId);

        return team;
    }

    async deleteTeam(teamId, userId) {
        // Verifica se o usuário é o dono do time
        const isOwner = await TeamMember.findOne({
            where: { teamId, userId, role: "owner" },
        });
        if (!isOwner) throw new Error("Você não tem permissão para excluir este time.");

        const team = await Team.findByPk(teamId);
        if (!team) throw new Error("Time não encontrado.");

        await this.logAction(userId, "delete_team", {
            teamId: team.id,
            teamName: team.name,
        }, team.id);

        await Team.destroy({ where: { id: teamId } });

        return true;
    }


    async addMemberByEmail(teamId, email, role, adminId) {
        const isAdmin = await TeamMember.findOne({
            where: { teamId, userId: adminId, role: ["admin", "owner"] },
        });
        if (!isAdmin) {
            throw new Error("Você não tem permissão para adicionar membros a este time.");
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        const existingMember = await TeamMember.findOne({ where: { teamId, userId: user.id } });
        if (existingMember) {
            throw new Error("Usuário já é membro deste time.");
        }

        const newMember = await TeamMember.create({ teamId, userId: user.id, role });

        // Atualiza o teamId no usuário
        const memberCount = await TeamMember.count({ where: { userId: user.id } });
        if (memberCount === 1) {
            await User.update(
                { teamId },
                { where: { id: user.id } }
            );
        }

        return { id: newMember.id, name: user.name, email: user.email, role: newMember.role };
    }



    async verifyMembership(teamId, userId) {
        const member = await TeamMember.findOne({
            where: { teamId, userId },
        });
        return !!member;
    }



    async removeMember(teamId, userId) {
        // Verifica se o membro existe no time
        const member = await TeamMember.findOne({ where: { teamId, userId } });
        if (!member) {
            throw new Error("Membro não encontrado no time.");
        }
    
        // Remove o membro
        await member.destroy();
    
        // Se o usuário não pertence a outros times, atualize o `teamId` no modelo `User`
        const remainingTeams = await TeamMember.count({ where: { userId } });
        if (remainingTeams === 0) {
            await User.update(
                { teamId: null },
                { where: { id: userId } }
            );
        }
    
        return true;
    }
    


    // Busca os membros do time
    async getMembersByTeam(teamId) {
        console.log("Repositório - Selecionando membros do time:", teamId);

        const members = await TeamMember.findAll({
            where: { teamId },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"],
                },
            ],
        });

        console.log("Membros encontrados:", members);
        return members.map((member) => ({
            id: member.user.id,
            name: member.user.name,
            email: member.user.email,
            role: member.role,
        }));
    }

    async getTeamsByUser(userId) {
        return await Team.findAll({
            attributes: ["id", "name", "updatedAt"], // Inclui o campo updatedAt
            include: [
                {
                    model: TeamMember,
                    as: "members",
                    where: {
                        userId,
                        role: ["admin", "owner"],
                    },
                    required: true,
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "email"],
                        },
                    ],
                },
            ],
        });
    }

    async logAction(userId, action, details, teamId) {
        if (!teamId) {
            throw new Error("O campo 'teamId' é obrigatório para registrar ações de auditoria.");
        }

        await AuditLog.create({
            userId,
            action,
            details: JSON.stringify(details), // Serializa os detalhes
            teamId,
        });
    }



    async getAuditLogs(userId) {
        return await AuditLog.findAll({
            where: { userId }, // Filtra logs pelo usuário autenticado
            attributes: { exclude: ['updatedAt'] }, // Exclui `updatedAt` da consulta
            order: [["createdAt", "DESC"]], // Ordena por data decrescente
        });
    }

    async createTransaction({ teamId, description, amount, type, date, createdBy }) {
        return await TeamTransaction.create({
            teamId,
            description,
            amount,
            type,
            date,
            createdBy,
        });
    }

    // Obter transações de um time
    async getTeamTransactions(teamId) {
        return await TeamTransaction.findAll({
            where: { teamId },
            attributes: ["id", "description", "amount", "type", "date", "createdBy"],
            order: [["date", "DESC"]],
        });
    }

    async addTeamTransaction(teamId, transactionData) {
        return await TeamTransaction.create({
            ...transactionData,
            teamId,
        });
    }

    async getTeamSummary(teamId) {
        const transactions = await this.getTeamTransactions(teamId);

        const summary = transactions.reduce(
            (acc, transaction) => {
                if (transaction.type === "income") {
                    acc.totalIncome += parseFloat(transaction.amount);
                } else {
                    acc.totalExpense += parseFloat(transaction.amount);
                }
                return acc;
            },
            { totalIncome: 0, totalExpense: 0, transactionCount: transactions.length }
        );

        summary.currentBalance = summary.totalIncome - summary.totalExpense;

        return summary;
    }

    async findMember(teamId, userId) {
        return await TeamMember.findOne({
            where: { teamId, userId },
            include: [
                {
                    model: User,
                    as: "user", // Certifique-se de que o alias "user" está configurado na associação
                    attributes: ["id", "name", "email"],
                },
            ],
        });
    }
    async countAdmins(teamId) {
        return await TeamMember.count({
            where: {
                teamId,
                role: "admin", // Filtra apenas admins
            },
        });
    }
    
}

module.exports = new TeamRepository();

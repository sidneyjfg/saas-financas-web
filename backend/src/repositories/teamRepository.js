const { Team, TeamMember, User, AuditLog } = require("../models");

class TeamRepository {
    async createTeam(name, ownerId) {
        const team = await Team.create({ name });
    
        await TeamMember.create({
            teamId: team.id,
            userId: ownerId,
            role: "owner",
        });
    
        // Registrar log de criação do time
        await this.logAction(ownerId, "create_team", { teamName: name }, team.id);
    
        return team;
    }
    



    async getTeams(userId) {
        return await Team.findAll({
            attributes: ["id", "name", "createdAt", "updatedAt"], // Inclui os campos necessários da tabela Team
            include: [
                {
                    model: TeamMember,
                    as: "members",
                    attributes: ["id", "role"], // Inclui os campos necessários da associação
                    where: { userId }, // Filtra pelos times em que o usuário é membro
                    required: true, // Garante que apenas os times relacionados sejam retornados
                },
            ],
        });
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
    
        // Recupera os detalhes do time antes de excluir
        const team = await Team.findByPk(teamId);
        if (!team) throw new Error("Time não encontrado.");
    
        // Cria o log de auditoria antes de excluir o time
        await this.logAction(userId, "delete_team", {
            teamId: team.id,
            teamName: team.name,
        }, team.id);
    
        // Exclui o time
        await Team.destroy({ where: { id: teamId } });
    
        return true;
    }

    



    async addMemberByEmail(teamId, email, role, adminId) {
        const isAdmin = await TeamMember.findOne({
            where: {
                teamId,
                userId: adminId,
                role: ["admin", "owner"],
            },
        });
        if (!isAdmin) {
            throw new Error("Você não tem permissão para adicionar membros a este time.");
        }
    
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
    
        const existingMember = await TeamMember.findOne({
            where: { teamId, userId: user.id },
        });
        if (existingMember) {
            throw new Error("Usuário já é membro deste time.");
        }
    
        const newMember = await TeamMember.create({
            teamId,
            userId: user.id,
            role,
        });
    
        // Registrar log de adição de membro
        await this.logAction(adminId, "add_member", {
            memberId: user.id,
            memberEmail: email,
            role,
        }, teamId);
    
        return {
            id: newMember.id,
            name: user.name,
            email: user.email,
            role: newMember.role,
        };
    }
    
    async verifyMembership(teamId, userId) {
        return await TeamMember.findOne({ where: { teamId, userId } });
    }
    async removeMember(teamId, userId, adminId) {
        const isAdmin = await TeamMember.findOne({
            where: {
                teamId,
                userId: adminId,
                role: ["admin", "owner"],
            },
        });
        if (!isAdmin) throw new Error("Sem permissão para remover membros.");
    
        const member = await TeamMember.findOne({ where: { teamId, userId } });
        if (!member) return null;
    
        await member.destroy();
    
        // Registrar log de remoção do membro
        await this.logAction(adminId, "remove_member", { removedUserId: userId }, teamId);
    
        return true;
    }
    

    // Busca os membros do time
    async getMembersByTeam(teamId) {
        const members = await TeamMember.findAll({
            where: { teamId },
            include: [
                {
                    model: User,
                    as: "user", // Alias definido na associação
                    attributes: ["id", "name", "email"], // Seleciona apenas os campos necessários
                },
            ],
        });

        // Retorna os membros formatados
        return members.map((member) => ({
            id: member.user.id, // ID do usuário
            name: member.user.name, // Nome do usuário
            email: member.user.email, // E-mail do usuário
            role: member.role, // Papel no time
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

}

module.exports = new TeamRepository();

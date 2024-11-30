const { Team, TeamMember, User } = require("../models");

class TeamRepository {
    async createTeam(name, ownerId) {
        // Cria o time
        const team = await Team.create({ name });
    
        // Adiciona o criador como membro do time com o papel de 'owner'
        await TeamMember.create({
            teamId: team.id,
            userId: ownerId,
            role: "owner",
        });
    
        return team;
    }
    


    async getTeams(userId) {
        return await Team.findAll({
            include: [
                {
                    model: TeamMember,
                    as: 'members',
                    where: { userId }, // Filtra apenas times com membros associados ao usuário
                    required: true,
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
        // Verifica se o usuário é o dono do time
        const isOwner = await TeamMember.findOne({
            where: { teamId, userId, role: "owner" },
        });
    
        if (!isOwner) return null;
    
        // Atualiza o nome do time
        const team = await Team.findByPk(teamId);
        if (!team) return null;
    
        team.name = name;
        return await team.save();
    }
    

    async deleteTeam(teamId, userId) {
        // Verifica se o usuário é o dono do time
        const isOwner = await TeamMember.findOne({
            where: { teamId, userId, role: "owner" },
        });
    
        if (!isOwner) return null;
    
        // Exclui o time
        await Team.destroy({ where: { id: teamId } });
        return true;
    }
    


    async addMemberByEmail(teamId, email, role, adminId) {
        // Verifica se o usuário logado é "admin" ou "owner"
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

        // Busca o usuário pelo email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        // Verifica se o usuário já é membro do time
        const existingMember = await TeamMember.findOne({
            where: {
                teamId,
                userId: user.id,
            },
        });
        if (existingMember) {
            throw new Error("Usuário já é membro deste time.");
        }

        // Cria o membro no time
        const newMember = await TeamMember.create({
            teamId,
            userId: user.id,
            role,
        });

        // Retorna o membro com os detalhes do usuário
        return {
            id: newMember.id,
            name: user.name, // Busca o nome do usuário
            email: user.email,
            role: newMember.role,
        };
    }

    async removeMember(teamId, userId, adminId) {
        const isAdmin = await TeamMember.findOne({
            where: {
                teamId, userId: adminId, role: ["admin", "owner"],
            }
        });
        if (!isAdmin) throw new Error("Sem permissão para remover membros.");
        const member = await TeamMember.findOne({ where: { teamId, userId } });
        if (!member) return null;
        await member.destroy();
        return true;
    }
    async verifyMembership(teamId, userId) {
        const member = await TeamMember.findOne({
            where: {
                teamId,
                userId,
            },
        });
        return !!member; // Retorna true se o usuário for membro do time
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
}

module.exports = new TeamRepository();

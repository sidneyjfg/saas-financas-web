const teamRepository = require("../repositories/teamRepository");

class TeamService {
  async createTeam(name, ownerId) {
    return await teamRepository.createTeam(name, ownerId);
  }

  async getTeams(userId) {
    const teams = await teamRepository.getTeams(userId);
  
    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      role: team.members.find((member) => member.userId === userId)?.role, // Identifica o papel do usuário no time
      members: team.members.length,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    }));
  }
  

  async getTeamById(teamId, userId) {
    return await teamRepository.getTeamById(teamId, userId);
  }

  async updateTeam(teamId, name, userId) {
    return await teamRepository.updateTeam(teamId, name, userId);
  }

  async deleteTeam(teamId, userId) {
    return await teamRepository.deleteTeam(teamId, userId);
  }

  async getMembersByTeam(teamId, userId) {
    // Verifica se o usuário pertence ao time
    const isMember = await teamRepository.verifyMembership(teamId, userId);
    if (!isMember) {
      throw new Error("Você não tem permissão para visualizar os membros deste time.");
    }

    // Busca os membros do time
    return await teamRepository.getMembersByTeam(teamId);
  }

  async addMemberByEmail(teamId, email, role, adminId) {
    return await teamRepository.addMemberByEmail(teamId, email, role, adminId);
  }


  async removeMember(teamId, userId, adminId) {
    const isAdmin = await teamRepository.verifyMembership(teamId, adminId);
  
    if (!isAdmin) throw new Error("Sem permissão para remover membros.");
  
    const member = await teamRepository.findMember(teamId, userId);
    if (!member) throw new Error("Membro não encontrado.");
  
    // Verifica se é o único administrador
    const admins = await teamRepository.getAdmins(teamId);
    if (admins.length <= 1 && member.role === "admin") {
      throw new Error("Não é possível remover o único administrador do time.");
    }
  
    await teamRepository.removeMember(teamId, userId);
  
    // Log de remoção de membro
    await teamRepository.logAction(adminId, "remove_member", { removedUserId: userId }, teamId);
  
    return true;
  }
  

  
  async getAuditLogs(userId) {
    return await teamRepository.getAuditLogs(userId);
  }

  async getTeamTransactions(teamId) {
    const transactions = await teamRepository.getTeamTransactions(teamId);

    // Calcula o resumo das transações
    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpense += transaction.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );

    summary.currentBalance = summary.totalIncome - summary.totalExpense;

    return { transactions, summary };
  }



}

module.exports = new TeamService();

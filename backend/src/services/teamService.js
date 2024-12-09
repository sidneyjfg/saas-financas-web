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
    // Verifica se o administrador tem permissão para remover membros
    const adminMember = await teamRepository.findMember(teamId, adminId);
    if (!adminMember || (adminMember.role !== "admin" && adminMember.role !== "owner")) {
      throw new Error("Você não tem permissão para remover membros deste time.");
    }

    // Verifica se o membro a ser removido existe no time
    const member = await teamRepository.findMember(teamId, userId);
    if (!member) {
      throw new Error("Membro não encontrado neste time.");
    }

    // Impede que o último administrador seja removido
    if (member.role === "admin") {
      const adminCount = await TeamMember.count({
        where: { teamId, role: "admin" },
      });

      if (adminCount <= 1) {
        throw new Error("Não é possível remover o último administrador do time.");
      }
    }

    return await teamRepository.removeMember(teamId, userId);
  }



  async getAuditLogs(userId) {
    return await teamRepository.getAuditLogs(userId);
  }

  async getTeamTransactions(teamId, userId) {
    // Verifica se o usuário pertence ao time antes de buscar as transações
    const isMember = await teamRepository.verifyMembership(teamId, userId);
    if (!isMember) {
      throw new Error("Você não tem permissão para visualizar as transações deste time.");
    }

    // Busca as transações e calcula o resumo
    const transactions = await teamRepository.getTeamTransactions(teamId);

    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.totalIncome += parseFloat(transaction.amount);
        } else {
          acc.totalExpense += parseFloat(transaction.amount);
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );

    summary.currentBalance = summary.totalIncome - summary.totalExpense;

    return { transactions, summary };
  }

  async addTeamTransaction(teamId, transactionData) {
    // Verifica se o time existe e se o usuário pertence ao time
    const isMember = await teamRepository.verifyMembership(teamId, transactionData.createdBy);
    if (!isMember) {
      throw new Error("Você não tem permissão para adicionar transações neste time.");
    }

    // Adiciona a transação ao time
    return await teamRepository.addTeamTransaction(teamId, transactionData);
  }

  async addTransaction({ teamId, description, amount, type, date, createdBy }) {
    // Verificar se o usuário pertence ao time
    const isMember = await teamRepository.verifyMembership(teamId, createdBy);
    if (!isMember) {
      throw new Error("Você não tem permissão para adicionar transações a este time.");
    }

    // Criação da transação
    return await teamRepository.createTransaction({
      teamId,
      description,
      amount,
      type,
      date,
      createdBy,
    });
  }

  // Obter transações e resumo
  async getTransactions(teamId) {
    const transactions = await teamRepository.getTeamTransactions(teamId);

    // Calcula o resumo das transações
    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.totalIncome += parseFloat(transaction.amount);
        } else if (transaction.type === "expense") {
          acc.totalExpense += parseFloat(transaction.amount);
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

const teamRepository = require("../repositories/teamRepository");

class TeamService {
  async createTeam(name, ownerId) {
    return await teamRepository.createTeam(name, ownerId);
  }

  async getTeams(userId) {
    return await teamRepository.getTeams(userId);
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
    return await teamRepository.removeMember(teamId, userId, adminId);
  }

  async getTeamsOverview(userId) {
    const teams = await teamRepository.getTeamsByUser(userId);

    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      updatedAt: team.updatedAt, // Inclua o campo updatedAt
      totalMembers: team.members.length,
      admins: team.members
        .filter((member) => member.role === "admin")
        .map((admin) => ({
          id: admin.user.id,
          name: admin.user.name,
          email: admin.user.email,
        })),
    }));
  }
  async getAuditLogs(userId) {
    return await teamRepository.getAuditLogs(userId);
}





}

module.exports = new TeamService();

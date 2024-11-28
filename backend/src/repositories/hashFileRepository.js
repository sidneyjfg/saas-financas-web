const { FileHashes } = require("../models");

module.exports = {
  async deleteAllByUserId(userId) {
    try {
      await FileHashes.destroy({
        where: {
          userId, // Garante que o hash pertence ao usuário
        },
      });
    } catch (error) {
      console.error("Erro ao excluir hash no repositório: ", error);
      throw error;
    }
  },
  
  async findHashByUserId(userId) {
    return await FileHashes.findOne({ where: { userId } });
  },

  async findHashByUserId(userId) {
    try {
      const hash = await FileHashes.findOne({
        where: { userId }, // Filtra pelo userId
      });
      return hash; // Retorna o hash encontrado ou null se não houver
    } catch (error) {
      throw new Error("Erro ao buscar o hash no banco de dados.");
    }
  }
};

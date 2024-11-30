const hashRepository = require("../repositories/hashFileRepository");

const hashService = {
    async getHashByUserId(userId) {
        if (!userId) {
            throw new Error("O ID do usuário é obrigatório para buscar o hash.");
        }

        const hash = await hashRepository.findHashByUserId(userId);
        if (!hash) {
            throw new Error("Nenhum hash encontrado para o usuário especificado.");
        }

        return hash.id;
    },  
};

module.exports = hashService;

const hashService = require("../services/hashFileService");

const hashController = {
    async getHashByUserId(req, res) {
        try {
            const { userId } = req.params; // Obtém o userId da URL (ex: /hash/:userId)
            
            if (!userId) {
                return res.status(400).json({ error: "O ID do usuário é obrigatório." });
            }

            const hash = await hashService.getHashByUserId(userId);
            return res.status(200).json(hash); // Retorna o hash encontrado
        } catch (error) {
            console.error("Erro ao buscar o hash:", error.message);
            return res.status(500).json({ error: error.message });
        }
    },
};

module.exports = hashController;

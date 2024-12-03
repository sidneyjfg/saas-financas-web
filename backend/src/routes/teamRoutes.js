const express = require("express");
const teamController = require("../controllers/teamController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.get("/audit-logs", authenticate, teamController.getAuditLogs);

// Rotas de times
router.post("/", authenticate, teamController.createTeam); // Criar um time
router.get("/", authenticate, teamController.getTeams); // Listar os times do usuário
router.get("/:id", authenticate, teamController.getTeamById); // Obter detalhes de um time
router.put("/:id", authenticate, teamController.updateTeam); // Atualizar um time
router.delete("/:id", authenticate, teamController.deleteTeam); // Excluir um time

// Rotas de membros do time
router.get("/:id/members", authenticate, teamController.getMembersByTeam);
router.post("/:id/members", authenticate, teamController.addMember); // Adicionar membro a um time
router.delete("/:id/members/:userId", authenticate, teamController.removeMember); // Remover membro de um time

router.get("/:teamId/transactions", authenticate, teamController.getTeamTransactions);


module.exports = router;

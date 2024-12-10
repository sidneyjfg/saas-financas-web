const express = require("express");
const teamController = require("../controllers/teamController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();
router.get("/audit-logs", authenticate, teamController.getAuditLogs);

router.get("/transactions", authenticate, teamController.getTeamTransactions);
router.post("/transactions", authenticate, teamController.addTeamTransaction);
router.get("/transactions", authenticate, teamController.getTransactions);
router.post("/transactions", authenticate, teamController.addTransaction);

// Rotas de membros do time
router.post("/", authenticate, teamController.createTeam); // Criar um time
router.get("/members", authenticate, teamController.getMembersByTeam); // Obter membros do time
router.post("/members", authenticate, teamController.addMember); // Adicionar membro ao time
router.delete("/members/:userId", authenticate, teamController.removeMember); // Remover membro do time
router.delete("/leave", authenticate, teamController.leaveTeam); // Rota para um membro sair do time

// Rotas de times
router.get("/", authenticate, teamController.getTeams); // Listar os times do usuário
router.put("/:id", authenticate, teamController.updateTeam); // Atualizar um time
router.delete("/:id", authenticate, teamController.deleteTeam); // Excluir um time







module.exports = router;

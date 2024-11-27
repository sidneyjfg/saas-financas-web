const categoryService = require('../services/categoryService');

class CategoryController {
  // Listagem de categorias Premium
  async listPremium(req, res) {
    const userId = req.user.id;
    const userPlan = req.user.plan; // Assume que o middleware de autenticação define o plano do usuário

    try {
      if (userPlan !== "Premium") {
        return res
          .status(403)
          .json({ message: "Acesso restrito a usuários Premium." });
      }

      const categories = await categoryService.getPremiumCategories(userId);
      console.log(categories);
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching Premium categories:", error.message);
      return res.status(500).json({ error: "Erro ao buscar categorias." });
    }
  }


  // Listagem de categorias Básicas
  async listBasic(req, res) {
    const userId = req.user.id;

    try {
      const categories = await categoryService.getBasicCategories(userId);
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching Basic categories:', error.message);
      return res.status(500).json({ error: 'Error fetching categories' });
    }
  }

  // Criação de categoria (compartilhado)
  async create(req, res) {
    const userId = req.user.id;
    const userPlan = req.user.plan; // Recuperado do middleware de autenticação
    const { name, color, keywords } = req.body;

    if (!name) {
      return res.status(400).json({ message: "O nome da categoria é obrigatório." });
    }

    try {
      // Para planos básicos, ignorar palavras-chave
      const keywordsArray = Array.isArray(keywords) ? keywords : [];

      const category = await categoryService.createCategory({
        name,
        color,
        keywords: keywordsArray,
        userId,
        userPlan,
      });
      return res.status(201).json(category);
    } catch (error) {
      console.error("Erro ao criar categoria:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }


  // Atualização de categoria
  async update(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, color, keywords } = req.body;

    try {
      // Verificar o tipo de `keywords` e converter para array se for string
      const keywordsArray = Array.isArray(keywords)
        ? keywords // Já é um array
        : keywords
          ? keywords.split(',').map((kw) => kw.trim()) // Converte de string para array
          : [];

      const category = await categoryService.updateCategory(id, {
        name,
        color,
        keywords: keywordsArray,
        userId,
      });

      return res.status(200).json(category);
    } catch (error) {
      console.error("Error updating category:", error.message);
      return res.status(500).json({ error: "Erro ao atualizar Categoria" });
    }
  }

  // Exclusão de categoria (compartilhado)
  async delete(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    try {
      await categoryService.deleteCategory(id, userId);
      return res.status(200).json({ message: 'Categoria excluída com sucesso' });
    } catch (error) {
      console.error('Error deleting category:', error.message);
      return res.status(500).json({ error: 'Error deleting category' });
    }
  }
}

module.exports = new CategoryController();

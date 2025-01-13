const categoryService = require('../services/categoryService');

class CategoryController {
  // Listagem de categorias Premium
  async listPremium(req, res) {
    const userId = req.user.id;
    const userPlan = req.user.plan;

    try {
      if (userPlan !== "Premium") {
        return res
          .status(403)
          .json({ message: "Acesso restrito a usuários Premium." });
      }

      const categories = await categoryService.getPremiumCategories(userId);
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Erro ao buscar categorias Premium:", error.message);
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
      console.error("Erro ao buscar categorias básicas:", error.message);
      return res.status(500).json({ error: "Erro ao buscar categorias." });
    }
  }

  // Criação de categoria (compartilhado)
  async create(req, res) {
    const userId = req.user.id;
    const userPlan = req.user.plan;
    const { name, color, keywords } = req.body;
    console.log("OIOIOIOIOIOOI: ",userPlan);
    if (!name) {
      return res.status(400).json({ message: "O nome da categoria é obrigatório." });
    }
  
    try {
      // Garante que keywords seja sempre um array
      const keywordsArray = Array.isArray(keywords)
        ? keywords
        : keywords
        ? keywords.split(",").map((kw) => kw.trim())
        : []; // Se for undefined, retorna um array vazio
  
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
      // Garante que keywords seja sempre um array
      const keywordsArray = Array.isArray(keywords)
        ? keywords
        : keywords
        ? keywords.split(",").map((kw) => kw.trim())
        : [];
  
      const category = await categoryService.updateCategory(id, {
        name,
        color,
        keywords: keywordsArray,
        userId,
      });
  
      return res.status(200).json(category);
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error.message);
      return res.status(500).json({ error: "Erro ao atualizar categoria." });
    }
  }
  
  
  // Exclusão de categoria (compartilhado)
  async delete(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    try {
      await categoryService.deleteCategory(id, userId);
      return res.status(200).json({ message: "Categoria excluída com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir categoria:", error.message);
      return res.status(500).json({ error: "Erro ao excluir categoria." });
    }
  }
}

module.exports = new CategoryController();

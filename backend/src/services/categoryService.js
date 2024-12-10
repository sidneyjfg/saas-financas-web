const categoryRepository = require('../repositories/categoryRepository');
const CATEGORY_LIMITS = {
  Basic: 5, // Limite de 5 categorias para o plano Basic
  Premium: Infinity, // Sem limite para o plano Premium
};

class CategoryService {

  // Listar categorias Premium
  async getPremiumCategories(userId) {
    return await categoryRepository.findAllPremiumByUser(userId);
  }

  async getBasicCategories(userId) {
    return await categoryRepository.findAllBasicByUser(userId);
  }
  
  async createCategory({ name, color, keywords, userId, userPlan }) {
    const currentCategoryCount = await categoryRepository.countByUser(userId);
    const limit = CATEGORY_LIMITS[userPlan] || 0;

    if (currentCategoryCount >= limit) {
      throw new Error(
        `Limite de categorias atingido para o plano ${userPlan}. Atualize para Premium para mais categorias.`
      );
    }

    return await categoryRepository.create({ name, color, keywords, userId });
  }
  

  // Atualizar categoria existente
  async updateCategory(id, categoryData) {
    const existingCategory = await categoryRepository.findCategoryByIdAndUser(
      id,
      categoryData.userId
    );
    if (!existingCategory) {
      throw new Error("Categoria não encontrada ou não pertence ao usuário.");
    }

    return await categoryRepository.update(id, categoryData);
  }


  // Excluir categoria
  async deleteCategory(id, userId) {
    const existingCategory = await categoryRepository.findCategoryByIdAndUser(
      id,
      userId
    );
    if (!existingCategory) {
      throw new Error("Categoria não encontrada ou não pertence ao usuário.");
    }

    return await categoryRepository.delete(id, userId);
  }
}

module.exports = new CategoryService();

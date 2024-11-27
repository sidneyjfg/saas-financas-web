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

  // Listar categorias Básicas
  async getBasicCategories(userId) {
    return await categoryRepository.findAllBasicByUser(userId);
  }

  
  async createCategory({ name, color, keywords, userId, userPlan }) {
    // Verificar o número atual de categorias
    const currentCategoryCount = await categoryRepository.countByUser(userId);
  
    // Obter o limite com base no plano
    const limit = CATEGORY_LIMITS[userPlan] || 0;
  
    // Verificar se o limite foi atingido
    if (currentCategoryCount >= limit) {
      throw new Error(
        `Limite de categorias atingido para o plano ${userPlan}. Atualize para Premium para mais categorias.`
      );
    }
  
    // Criar a categoria
    return await categoryRepository.create({ name, color, keywords, userId });
  }
  

  // Atualizar categoria existente
  async updateCategory(id, categoryData) {
    try {
      // Chamar o repositório para atualizar os dados
      return await categoryRepository.update(id, categoryData);
    } catch (error) {
      console.error("Error in updateCategory service:", error.message);
      throw error;
    }
  }


  // Excluir categoria
  async deleteCategory(id, userId) {
    return await categoryRepository.delete(id, userId);
  }
}

module.exports = new CategoryService();

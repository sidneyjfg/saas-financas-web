const categoryRepository = require('../repositories/categoryRepository');

class CategoryService {
  // Listar categorias Premium
  async getPremiumCategories(userId) {
    return await categoryRepository.findAllPremiumByUser(userId);
  }

  // Listar categorias Básicas
  async getBasicCategories(userId) {
    return await categoryRepository.findAllBasicByUser(userId);
  }

  // Criar nova categoria
  async createCategory(categoryData) {
    return await categoryRepository.create(categoryData);
  }

  // Atualizar categoria existente
  async updateCategory(id, categoryData) {
    return await categoryRepository.update(id, categoryData);
  }

  // Excluir categoria
  async deleteCategory(id, userId) {
    return await categoryRepository.delete(id, userId);
  }
}

module.exports = new CategoryService();

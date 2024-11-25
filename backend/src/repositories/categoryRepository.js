const { Category } = require('../models');

class CategoryRepository {
  // Buscar categorias Premium de um usuário
  async findAllPremiumByUser(userId) {
    return await Category.findAll({
      where: { userId },
      attributes: ['id', 'name', 'color'], // Retorna somente os campos necessários
      order: [['name', 'ASC']],
    });
  }

  // Buscar categorias Básicas de um usuário
  async findAllBasicByUser(userId) {
    return await Category.findAll({
      where: { userId },
      attributes: ['id', 'name', 'color'], // Retorna somente os campos necessários
      limit: 5, // Limita o número de categorias para usuários Basic
      order: [['name', 'ASC']],
    });
  }

  // Criar nova categoria
  async create(categoryData) {
    return await Category.create(categoryData);
  }

  // Atualizar uma categoria existente
  async update(id, categoryData) {
    return await Category.update(categoryData, {
      where: { id, userId: categoryData.userId },
    });
  }

  async countByUser(userId) {
    return await Category.count({
      where: { userId },
    });
  }
  
  // Excluir uma categoria
  async delete(id, userId) {
    return await Category.destroy({
      where: { id, userId },
    });
  }
}

module.exports = new CategoryRepository();

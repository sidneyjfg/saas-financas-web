const { Category } = require('../models');

class CategoryRepository {
  // Buscar categorias Premium de um usuário
  async findAllPremiumByUser(userId) {
    console.log("findAllPremiumByUser, ", userId);
    return await Category.findAll({
      where: { userId },
      attributes: ['id', 'name', 'color', 'keywords'], // Inclua 'keywords'
    });
  }

  // Buscar categorias Básicas de um usuário
  async findAllBasicByUser(userId) {
    return await Category.findAll({
      where: { userId },
      attributes: ['id', 'name', 'color', 'keywords'],
      limit: 5, // Limita o número de categorias para usuários Basic
      order: [['name', 'ASC']],
    });
  }

  // Criar nova categoria
  async create(categoryData) {
    return await Category.create({
      name: categoryData.name,
      color: categoryData.color || "#000000", // Cor padrão
      keywords: categoryData.keywords, // Insere diretamente como array
      userId: categoryData.userId,
    });
  }


  // Atualizar uma categoria existente
  async update(id, categoryData) {
    try {
      // Atualizar a categoria no banco
      return await Category.update(
        {
          name: categoryData.name,
          color: categoryData.color,
          keywords: JSON.stringify(categoryData.keywords), // Armazenar como JSON
        },
        {
          where: { id, userId: categoryData.userId },
        }
      );
    } catch (error) {
      console.error("Error in update repository:", error.message);
      throw error;
    }
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

const { Category } = require('../models');

class CategoryRepository {
  // Buscar categorias Premium de um usuário
  async findAllPremiumByUser(userId) {
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

  async findCategoryByIdAndUser(categoryId, userId) {
    if (!categoryId || !userId) {
        throw new Error("Categoria ou usuário inválido.");
    }
    return await Category.findOne({
        where: { id: categoryId, userId },
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


  async update(id, categoryData) {
    try {  
      const [updated] = await Category.update(
        {
          name: categoryData.name,
          color: categoryData.color,
          keywords: categoryData.keywords, // Passe diretamente o array
        },
        {
          where: { id, userId: categoryData.userId },
          silent: true, // Garante que o Sequelize force o UPDATE
        }
      );
  
      if (updated) {
        const updatedCategory = await Category.findOne({ where: { id, userId: categoryData.userId } });
        return updatedCategory;
      }
  
      throw new Error("Categoria não encontrada ou não atualizada.");
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

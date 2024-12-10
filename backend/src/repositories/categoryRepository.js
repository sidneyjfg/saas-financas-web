const { Category } = require('../models');

class CategoryRepository {
  // Buscar categorias Premium de um usuário
  async findAllPremiumByUser(userId) {
    const categories = await Category.findAll({
      where: { userId },
      attributes: ["id", "name", "color", "keywords"],
    });

    return categories.map((category) => ({
      ...category.dataValues,
      keywords: Array.isArray(category.keywords)
        ? category.keywords
        : category.keywords
        ? category.keywords.split(",").map((k) => k.trim())
        : [],
    }));
  }


  // Buscar categorias Básicas de um usuário
  async findAllBasicByUser(userId) {
    return await Category.findAll({
      where: { userId },
      attributes: ["id", "name", "color", "keywords"],
      limit: 5,
      order: [["name", "ASC"]],
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
      color: categoryData.color || "#000000",
      keywords: categoryData.keywords,
      userId: categoryData.userId,
    });
  }

  async update(id, categoryData) {
    const [updated] = await Category.update(
      {
        name: categoryData.name,
        color: categoryData.color,
        keywords: categoryData.keywords,
      },
      {
        where: { id, userId: categoryData.userId },
      }
    );

    if (updated) {
      return await Category.findOne({ where: { id, userId: categoryData.userId } });
    }

    throw new Error("Categoria não encontrada ou não atualizada.");
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

// src/services/article.service.js
const prisma = require('../config/database');
const { getPagination } = require('../utils/helpers');
const { STATUS, ERROR_MESSAGES } = require('../utils/constants');

class ArticleService {
  async createArticle(articleData, authorId) {
    const article = await prisma.article.create({
      data: {
        ...articleData,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return article;
  }

  async getArticles(filters = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      authorId,
      search,
    } = filters;

    // Build where clause
    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (authorId) {
      where.authorId = authorId;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.article.count({ where });

    // Get articles with pagination
    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const pagination = getPagination(page, limit, total);

    return {
      articles,
      pagination,
    };
  }

  async getPublicArticles(filters = {}) {
    const { page = 1, limit = 10, search } = filters;

    const where = {
      status: STATUS.PUBLISHED,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.article.count({ where });

    // Get articles with pagination
    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const pagination = getPagination(page, limit, total);

    return {
      articles,
      pagination,
    };
  }

  async getArticleById(id) {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!article) {
      throw new Error(ERROR_MESSAGES.ARTICLE_NOT_FOUND);
    }

    return article;
  }

  async updateArticle(id, updateData, userId, userRole) {
    // First check if article exists
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new Error(ERROR_MESSAGES.ARTICLE_NOT_FOUND);
    }

    // Check permissions
    if (userRole !== 'ADMIN' && article.authorId !== userId) {
      throw new Error(ERROR_MESSAGES.FORBIDDEN);
    }

    // Update article
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return updatedArticle;
  }

  async deleteArticle(id, userRole) {
    // First check if article exists
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new Error(ERROR_MESSAGES.ARTICLE_NOT_FOUND);
    }

    // Check permissions (only admin can delete)
    if (userRole !== 'ADMIN') {
      throw new Error(ERROR_MESSAGES.FORBIDDEN);
    }

    // Delete article
    await prisma.article.delete({
      where: { id },
    });

    return { success: true };
  }

  async getUserArticles(userId, filters = {}) {
    const { page = 1, limit = 10, status } = filters;

    const where = {
      authorId: userId,
    };

    if (status) {
      where.status = status;
    }

    // Get total count
    const total = await prisma.article.count({ where });

    // Get articles with pagination
    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const pagination = getPagination(page, limit, total);

    return {
      articles,
      pagination,
    };
  }
}

module.exports = new ArticleService();
// src/controllers/article.controller.js
const articleService = require('../services/article.service');
const { SUCCESS_MESSAGES } = require('../utils/constants');

class ArticleController {
  async createArticle(req, res, next) {
    try {
      const articleData = req.validatedData;
      const authorId = req.user.id;
      
      const article = await articleService.createArticle(articleData, authorId);

      res.status(201).json({
        success: true,
        message: SUCCESS_MESSAGES.ARTICLE_CREATED,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  }

  async getArticles(req, res, next) {
    try {
      const filters = req.validatedData;
      const result = await articleService.getArticles(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublicArticles(req, res, next) {
    try {
      const filters = req.query;
      const result = await articleService.getPublicArticles(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getArticle(req, res, next) {
    try {
      const { id } = req.params;
      const article = await articleService.getArticleById(parseInt(id));

      res.status(200).json({
        success: true,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateArticle(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.validatedData;
      const userId = req.user.id;
      const userRole = req.user.role;

      const article = await articleService.updateArticle(
        parseInt(id),
        updateData,
        userId,
        userRole
      );

      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.ARTICLE_UPDATED,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteArticle(req, res, next) {
    try {
      const { id } = req.params;
      const userRole = req.user.role;

      await articleService.deleteArticle(parseInt(id), userRole);

      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.ARTICLE_DELETED,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserArticles(req, res, next) {
    try {
      const userId = req.user.id;
      const filters = req.query;

      const result = await articleService.getUserArticles(userId, filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ArticleController();
// src/routes/article.routes.js
const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const authenticate = require('../middlewares/auth');
const { checkRole, checkArticlePermission } = require('../middlewares/roleCheck');
const validate = require('../middlewares/validation');
const { 
  createArticleSchema, 
  updateArticleSchema, 
  getArticlesSchema 
} = require('../validations/article.validation');
const { PERMISSIONS } = require('../utils/constants');

// Public route (no authentication required)
router.get('/public', articleController.getPublicArticles);

// Protected routes
router.get(
  '/',
  authenticate,
  checkRole(PERMISSIONS.VIEW_ARTICLES),
  validate(getArticlesSchema),
  articleController.getArticles
);

router.get(
  '/my-articles',
  authenticate,
  validate(getArticlesSchema),
  articleController.getUserArticles
);

router.get(
  '/:id',
  authenticate,
  checkRole(PERMISSIONS.VIEW_ARTICLES),
  articleController.getArticle
);

router.post(
  '/',
  authenticate,
  checkRole(PERMISSIONS.CREATE_ARTICLE),
  validate(createArticleSchema),
  articleController.createArticle
);

router.put(
  '/:id',
  authenticate,
  checkArticlePermission('edit'),
  validate(updateArticleSchema),
  articleController.updateArticle
);

router.delete(
  '/:id',
  authenticate,
  checkArticlePermission('delete'),
  articleController.deleteArticle
);

module.exports = router;
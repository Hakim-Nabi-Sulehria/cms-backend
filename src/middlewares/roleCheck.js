// src/middlewares/roleCheck.js
const { hasPermission } = require('../utils/helpers');
const { ERROR_MESSAGES } = require('../utils/constants');
const prisma = require('../config/database');

const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED,
        });
      }

      if (!hasPermission(req.user.role, requiredRoles)) {
        return res.status(403).json({
          success: false,
          message: ERROR_MESSAGES.FORBIDDEN,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const checkArticlePermission = (action) => {
  return async (req, res, next) => {
    try {
      const articleId = parseInt(req.params.id);
      const userId = req.user.id;
      const userRole = req.user.role;

      // Get article
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!article) {
        return res.status(404).json({
          success: false,
          message: ERROR_MESSAGES.ARTICLE_NOT_FOUND,
        });
      }

      // Check permissions based on action
      let hasAccess = false;
      
      switch (action) {
        case 'edit':
          if (userRole === 'ADMIN') hasAccess = true;
          else if (userRole === 'EDITOR' && article.authorId === userId) hasAccess = true;
          break;
        
        case 'delete':
          if (userRole === 'ADMIN') hasAccess = true;
          break;
        
        case 'view':
          if (userRole === 'ADMIN' || userRole === 'EDITOR' || userRole === 'VIEWER') hasAccess = true;
          break;
        
        default:
          hasAccess = false;
      }

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: ERROR_MESSAGES.FORBIDDEN,
        });
      }

      // Attach article to request for use in controller
      req.article = article;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { checkRole, checkArticlePermission };
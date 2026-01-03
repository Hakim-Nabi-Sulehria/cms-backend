// src/utils/constants.js
module.exports = {
  ROLES: {
    ADMIN: 'ADMIN',
    EDITOR: 'EDITOR',
    VIEWER: 'VIEWER',
  },
  
  STATUS: {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
  },
  
  PERMISSIONS: {
    CREATE_ARTICLE: ['ADMIN', 'EDITOR'],
    EDIT_OWN_ARTICLE: ['ADMIN', 'EDITOR'],
    EDIT_ANY_ARTICLE: ['ADMIN'],
    DELETE_ARTICLE: ['ADMIN'],
    VIEW_ARTICLES: ['ADMIN', 'EDITOR', 'VIEWER'],
  },
  
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  
  ERROR_MESSAGES: {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden: Insufficient permissions',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation failed',
    DUPLICATE_EMAIL: 'Email already exists',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ARTICLE_NOT_FOUND: 'Article not found',
    USER_NOT_FOUND: 'User not found',
  },
  
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    REGISTER_SUCCESS: 'Registration successful',
    LOGOUT_SUCCESS: 'Logout successful',
    ARTICLE_CREATED: 'Article created successfully',
    ARTICLE_UPDATED: 'Article updated successfully',
    ARTICLE_DELETED: 'Article deleted successfully',
  },
};
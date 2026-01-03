// src/utils/helpers.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  // Hash password
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },

  // Compare password
  comparePassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },

  // Generate JWT token
  generateToken: (userId, role) => {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  },

  // Verify JWT token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  // Generate pagination metadata
  getPagination: (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  },

  // Sanitize user object (remove password)
  sanitizeUser: (user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Check if user has permission
  hasPermission: (userRole, requiredRoles) => {
    return requiredRoles.includes(userRole);
  },

  // Check if user can edit article
  canEditArticle: (article, user) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    if (user.role === 'EDITOR' && article.authorId === user.id) return true;
    return false;
  },

  // Check if user can delete article
  canDeleteArticle: (user) => {
    return user?.role === 'ADMIN';
  },
};
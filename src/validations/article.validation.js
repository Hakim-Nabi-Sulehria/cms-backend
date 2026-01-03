// src/validations/article.validation.js
const { z } = require('zod');
const { STATUS } = require('../utils/constants');

const createArticleSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content cannot exceed 10000 characters'),
  status: z.enum([STATUS.DRAFT, STATUS.PUBLISHED]).optional().default(STATUS.DRAFT),
});

const updateArticleSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .optional(),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content cannot exceed 10000 characters')
    .optional(),
  status: z.enum([STATUS.DRAFT, STATUS.PUBLISHED]).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

const getArticlesSchema = z.object({
  page: z.string().optional().transform(val => parseInt(val, 10) || 1),
  limit: z.string().optional().transform(val => parseInt(val, 10) || 10),
  status: z.enum([STATUS.DRAFT, STATUS.PUBLISHED]).optional(),
  authorId: z.string().optional().transform(val => parseInt(val, 10)),
  search: z.string().optional(),
});

module.exports = {
  createArticleSchema,
  updateArticleSchema,
  getArticlesSchema,
};
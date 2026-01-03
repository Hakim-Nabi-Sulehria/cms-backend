// src/middlewares/validation.js
const { ERROR_MESSAGES } = require('../utils/constants');

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse({
        ...req.body,
        ...req.query,
        ...req.params,
      });
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error.errors) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          errors: validationErrors,
        });
      }
      next(error);
    }
  };
};

module.exports = validate;
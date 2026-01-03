// src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const { SUCCESS_MESSAGES } = require('../utils/constants');

class AuthController {
  async register(req, res, next) {
    try {
      const userData = req.validatedData;
      const result = await authService.register(userData);

      res.status(201).json({
        success: true,
        message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.validatedData;
      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await authService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const updateData = req.validatedData;
      
      const user = await authService.updateProfile(userId, updateData);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      // In a stateless JWT system, client should remove the token
      // We could implement token blacklisting here if needed
      
      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
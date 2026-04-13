const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authMiddleware } = require('../middleware/auth');

/**
 * 认证路由
 * POST /api/auth/login - 用户登录
 * GET /api/auth/profile - 获取当前用户信息
 */

// 用户登录
router.post('/login', authController.login);

// 获取当前用户信息（需要认证）
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;

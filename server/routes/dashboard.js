const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');
const { authMiddleware } = require('../middleware/auth');

/**
 * 数据统计路由
 * GET /api/dashboard/stats - 获取统计数据
 */

// 获取统计数据（需要认证）
router.get('/stats', authMiddleware, dashboardController.getStats);

module.exports = router;

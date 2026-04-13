const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getOrders, deleteOrder, createOrder } = require('../controllers/orders');

// GET /api/orders - 获取订单列表（需要认证）
router.get('/', authMiddleware, getOrders);

// DELETE /api/orders/:id - 删除订单（需要认证）
router.delete('/:id', authMiddleware, deleteOrder);

// POST /api/orders/create - 创建订单（公开接口，H5页面下单用）
router.post('/create', createOrder);

module.exports = router;

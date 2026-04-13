const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
const { authMiddleware } = require('../middleware/auth');
const { adminOnly } = require('../middleware/role');

/**
 * 商品管理路由
 * GET /api/products - 获取商品列表
 * GET /api/products/:id - 获取单个商品详情
 * POST /api/products - 创建商品（需要admin权限）
 * PUT /api/products/:id - 更新商品（需要admin权限）
 * DELETE /api/products/:id - 删除商品（需要admin权限）
 */

// 获取商品列表（需要认证）
router.get('/', authMiddleware, productsController.getProducts);

// 获取公开商品详情（不需要认证）- 必须放在 /:id 路由之前
router.get('/public/:id', productsController.getPublicProduct);

// 获取单个商品详情（需要认证）
router.get('/:id', authMiddleware, productsController.getProductById);

// 创建商品（需要认证 + admin权限）
router.post('/', authMiddleware, adminOnly, productsController.createProduct);

// 更新商品（需要认证 + admin权限）
router.put('/:id', authMiddleware, adminOnly, productsController.updateProduct);

// 删除商品（需要认证 + admin权限）
router.delete('/:id', authMiddleware, adminOnly, productsController.deleteProduct);

module.exports = router;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const config = require('../config');

/**
 * 用户登录
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      });
    }

    // 查询用户
    const user = await db('users').where({ username }).first();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 验证密码
    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 生成 JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        site_code: user.site_code
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // 返回用户信息（不含密码）
    const userInfo = {
      id: user.id,
      username: user.username,
      role: user.role,
      site_code: user.site_code
    };

    res.json({
      success: true,
      message: '登录成功',
      token,
      user: userInfo
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '登录过程中发生错误'
    });
  }
}

/**
 * 获取当前用户信息
 * GET /api/auth/profile
 */
async function getProfile(req, res) {
  try {
    const userId = req.user.id;

    const user = await db('users')
      .select('id', 'username', 'role', 'vip_status', 'vip_expire_at', 'commission_rate', 'balance', 'total_commission', 'status', 'site_code', 'created_at', 'updated_at')
      .where({ id: userId })
      .first();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息时发生错误'
    });
  }
}

module.exports = {
  login,
  getProfile
};

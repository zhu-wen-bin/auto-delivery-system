const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * JWT认证中间件
 * 从 Authorization: Bearer <token> 头部提取并验证token
 */
function authMiddleware(req, res, next) {
  try {
    // 获取Authorization头部
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: '未提供认证令牌' 
      });
    }

    // 检查Bearer格式
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ 
        success: false, 
        message: '认证格式错误，请使用 Bearer <token> 格式' 
      });
    }

    const token = parts[1];

    // 验证token
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            success: false, 
            message: '令牌已过期，请重新登录' 
          });
        }
        return res.status(401).json({ 
          success: false, 
          message: '无效的令牌' 
        });
      }

      // 将解码后的用户信息附加到请求对象
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: '认证过程中发生错误' 
    });
  }
}

/**
 * 可选认证中间件
 * 验证token但不强制要求，用于需要获取用户信息但允许匿名访问的接口
 */
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (!err) {
        req.user = decoded;
      }
      next();
    });
  } catch (error) {
    next();
  }
}

module.exports = {
  authMiddleware,
  optionalAuth
};

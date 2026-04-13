/**
 * 角色权限中间件
 * 接受允许的角色数组，检查 req.user.role 是否在允许列表中
 * @param {string[]} allowedRoles - 允许访问的角色数组，如 ['admin', 'agent']
 * @returns {Function} Express中间件函数
 */
function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    try {
      // 确保用户已认证（req.user 应该已由 authMiddleware 设置）
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '未登录，请先登录'
        });
      }

      const userRole = req.user.role;

      // 检查用户角色是否在允许列表中
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: '权限不足，无法访问此资源'
        });
      }

      // 角色验证通过
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return res.status(500).json({
        success: false,
        message: '权限验证过程中发生错误'
      });
    }
  };
}

/**
 * 管理员权限中间件
 * 快捷方式，仅允许 admin 角色访问
 */
function adminOnly(req, res, next) {
  return roleMiddleware(['admin'])(req, res, next);
}

/**
 * 代理权限中间件
 * 快捷方式，允许 admin 和 agent 角色访问
 */
function agentOrAdmin(req, res, next) {
  return roleMiddleware(['admin', 'agent'])(req, res, next);
}

module.exports = {
  roleMiddleware,
  adminOnly,
  agentOrAdmin
};

const db = require('../database/db');

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm:ss
 */
function formatDateTime(date) {
  const dateStr = formatDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}:${seconds}`;
}

/**
 * 获取统计数据
 * GET /api/dashboard/stats
 */
async function getStats(req, res) {
  try {
    const now = new Date();
    const today = formatDate(now);
    const yesterday = formatDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    // 今日统计
    const todayStats = await getPeriodStats(today, formatDateTime(new Date(now.getTime() + 24 * 60 * 60 * 1000)));

    // 昨日统计
    const yesterdayStats = await getPeriodStats(yesterday, today);

    // 本月统计
    const monthStats = await getPeriodStats(monthStart, formatDateTime(new Date(now.getTime() + 24 * 60 * 60 * 1000)));

    // 总计统计
    const totalStats = await getTotalStats();

    // 最近7天每日统计
    const dailyStats = await getDailyStats(7);

    res.json({
      success: true,
      stats: {
        today: todayStats,
        yesterday: yesterdayStats,
        month: monthStats,
        total: totalStats
      },
      dailyStats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: '获取统计数据时发生错误'
    });
  }
}

/**
 * 获取指定时间段的统计数据
 * @param {string} startDate - 开始日期 (YYYY-MM-DD)
 * @param {string} endDate - 结束日期 (YYYY-MM-DD 或 YYYY-MM-DD HH:mm:ss)
 */
async function getPeriodStats(startDate, endDate) {
  // 确保结束日期包含当天所有时间
  const endDateTime = endDate.includes(' ') ? endDate : `${endDate} 23:59:59`;
  const startDateTime = `${startDate} 00:00:00`;

  // 统计订单数（status != 'pending' 的算有效订单）
  const ordersResult = await db('orders')
    .where('created_at', '>=', startDateTime)
    .where('created_at', '<=', endDateTime)
    .whereNot('status', 'pending')
    .count('id as count')
    .first();

  // 统计收入（status != 'pending' 的订单金额总和）
  const revenueResult = await db('orders')
    .where('created_at', '>=', startDateTime)
    .where('created_at', '<=', endDateTime)
    .whereNot('status', 'pending')
    .sum('amount as total')
    .first();

  // 统计访客数
  const visitorsResult = await db('visitor_logs')
    .where('created_at', '>=', startDateTime)
    .where('created_at', '<=', endDateTime)
    .count('id as count')
    .first();

  return {
    orders: ordersResult?.count || 0,
    revenue: revenueResult?.total || 0,
    visitors: visitorsResult?.count || 0
  };
}

/**
 * 获取总计统计数据
 */
async function getTotalStats() {
  // 统计所有有效订单数
  const ordersResult = await db('orders')
    .whereNot('status', 'pending')
    .count('id as count')
    .first();

  // 统计所有有效订单收入
  const revenueResult = await db('orders')
    .whereNot('status', 'pending')
    .sum('amount as total')
    .first();

  // 统计所有访客数
  const visitorsResult = await db('visitor_logs')
    .count('id as count')
    .first();

  return {
    orders: ordersResult?.count || 0,
    revenue: revenueResult?.total || 0,
    visitors: visitorsResult?.count || 0
  };
}

/**
 * 获取最近N天的每日统计数据
 * @param {number} days - 天数
 */
async function getDailyStats(days) {
  const result = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = formatDate(date);
    const startDateTime = `${dateStr} 00:00:00`;
    const endDateTime = `${dateStr} 23:59:59`;

    // 统计该日订单数
    const ordersResult = await db('orders')
      .where('created_at', '>=', startDateTime)
      .where('created_at', '<=', endDateTime)
      .whereNot('status', 'pending')
      .count('id as count')
      .first();

    // 统计该日收入
    const revenueResult = await db('orders')
      .where('created_at', '>=', startDateTime)
      .where('created_at', '<=', endDateTime)
      .whereNot('status', 'pending')
      .sum('amount as total')
      .first();

    // 统计该日访客数
    const visitorsResult = await db('visitor_logs')
      .where('created_at', '>=', startDateTime)
      .where('created_at', '<=', endDateTime)
      .count('id as count')
      .first();

    result.push({
      date: dateStr,
      orders: ordersResult?.count || 0,
      revenue: revenueResult?.total || 0,
      visitors: visitorsResult?.count || 0
    });
  }

  return result;
}

module.exports = {
  getStats
};

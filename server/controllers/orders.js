const db = require('../database/db');

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm:ss
 */
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 生成订单号
 * 格式：WP + 年月日时分秒 + 4位随机数
 */
function generateOrderNo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `WP${year}${month}${day}${hours}${minutes}${seconds}${random}`;
}

/**
 * 获取订单列表
 * GET /api/orders
 * 支持查询参数：page(默认1), pageSize(默认20), keyword(搜索商品名称), startDate(开始日期), endDate(结束日期), status(订单状态筛选)
 */
async function getOrders(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const keyword = req.query.keyword || '';
    const startDate = req.query.startDate || '';
    const endDate = req.query.endDate || '';
    const status = req.query.status || '';

    const offset = (page - 1) * pageSize;

    // 构建查询
    let query = db('orders');

    // 搜索商品名称
    if (keyword) {
      query = query.where('product_name', 'like', `%${keyword}%`);
    }

    // 状态筛选
    if (status) {
      query = query.where('status', status);
    }

    // 日期范围筛选
    if (startDate) {
      query = query.where('created_at', '>=', `${startDate} 00:00:00`);
    }
    if (endDate) {
      query = query.where('created_at', '<=', `${endDate} 23:59:59`);
    }

    // 获取总数
    const countResult = await query.clone().count('id as total').first();
    const total = countResult?.total || 0;

    // 获取分页数据，按 created_at 倒序排列
    const list = await query
      .select('id', 'order_no', 'product_id', 'product_name', 'agent_username', 'amount', 'status', 'paid_at', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(pageSize)
      .offset(offset);

    res.json({
      success: true,
      list,
      total,
      page,
      pageSize
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: '获取订单列表时发生错误'
    });
  }
}

/**
 * 删除订单
 * DELETE /api/orders/:id
 */
async function deleteOrder(req, res) {
  try {
    const { id } = req.params;

    // 检查订单是否存在
    const existingOrder = await db('orders').where({ id }).first();

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    await db('orders').where({ id }).del();

    res.json({
      success: true,
      message: '订单删除成功'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: '删除订单时发生错误'
    });
  }
}

/**
 * 创建订单（公开接口，H5页面下单用）
 * POST /api/orders/create
 * 接收 { product_id }
 */
async function createOrder(req, res) {
  try {
    const { product_id } = req.body;

    // 验证必填字段
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: '商品ID不能为空'
      });
    }

    // 查询商品信息
    const product = await db('products')
      .select('id', 'name', 'site_code', 'price', 'status')
      .where({ id: product_id })
      .first();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    if (product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: '商品已下架'
      });
    }

    const now = formatDateTime(new Date());
    const orderNo = generateOrderNo();

    // 创建订单
    const [id] = await db('orders').insert({
      order_no: orderNo,
      product_id: product.id,
      product_name: product.name,
      agent_username: product.site_code || 'system',
      amount: product.price,
      status: 'paid', // 模拟已支付
      paid_at: now,
      created_at: now
    });

    // 获取刚创建的订单
    const order = await db('orders')
      .select('id', 'order_no', 'product_id', 'product_name', 'agent_username', 'amount', 'status', 'paid_at', 'created_at')
      .where({ id })
      .first();

    res.status(201).json({
      success: true,
      message: '订单创建成功',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: '创建订单时发生错误'
    });
  }
}

module.exports = {
  getOrders,
  deleteOrder,
  createOrder
};

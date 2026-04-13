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
 * 获取商品列表
 * GET /api/products
 * 支持查询参数：page(默认1), pageSize(默认20), keyword(搜索商品名称)
 */
async function getProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const keyword = req.query.keyword || '';

    const offset = (page - 1) * pageSize;

    // 构建查询
    let query = db('products');

    // 如果有搜索关键词
    if (keyword) {
      query = query.where('name', 'like', `%${keyword}%`);
    }

    // 获取总数
    const countResult = await query.clone().count('id as total').first();
    const total = countResult?.total || 0;

    // 获取分页数据
    const list = await query
      .select('id', 'name', 'site_code', 'delivery_type', 'stock', 'price', 'status', 'created_at', 'updated_at')
      .orderBy('id', 'desc')
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
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: '获取商品列表时发生错误'
    });
  }
}

/**
 * 获取单个商品详情
 * GET /api/products/:id
 */
async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await db('products')
      .select('id', 'name', 'site_code', 'delivery_type', 'delivery_content', 'stock', 'price', 'status', 'created_at', 'updated_at')
      .where({ id })
      .first();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product by id error:', error);
    res.status(500).json({
      success: false,
      message: '获取商品详情时发生错误'
    });
  }
}

/**
 * 创建商品
 * POST /api/products
 * 接收 { name, site_code, delivery_type, delivery_content, stock, price, status }
 */
async function createProduct(req, res) {
  try {
    const { name, site_code, delivery_type, delivery_content, stock, price, status } = req.body;

    // 验证必填字段
    if (!name || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: '商品名称和价格不能为空'
      });
    }

    const now = formatDateTime(new Date());

    const [id] = await db('products').insert({
      name,
      site_code: site_code || null,
      delivery_type: delivery_type || 'netdisk',
      delivery_content: delivery_content || null,
      stock: stock !== undefined ? stock : -1,
      price,
      status: status || 'active',
      created_at: now,
      updated_at: now
    });

    const product = await db('products')
      .select('id', 'name', 'site_code', 'delivery_type', 'delivery_content', 'stock', 'price', 'status', 'created_at', 'updated_at')
      .where({ id })
      .first();

    res.status(201).json({
      success: true,
      message: '商品创建成功',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: '创建商品时发生错误'
    });
  }
}

/**
 * 更新商品
 * PUT /api/products/:id
 */
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, site_code, delivery_type, delivery_content, stock, price, status } = req.body;

    // 检查商品是否存在
    const existingProduct = await db('products').where({ id }).first();

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    const now = formatDateTime(new Date());

    const updateData = {
      updated_at: now
    };

    if (name !== undefined) updateData.name = name;
    if (site_code !== undefined) updateData.site_code = site_code;
    if (delivery_type !== undefined) updateData.delivery_type = delivery_type;
    if (delivery_content !== undefined) updateData.delivery_content = delivery_content;
    if (stock !== undefined) updateData.stock = stock;
    if (price !== undefined) updateData.price = price;
    if (status !== undefined) updateData.status = status;

    await db('products').where({ id }).update(updateData);

    const product = await db('products')
      .select('id', 'name', 'site_code', 'delivery_type', 'delivery_content', 'stock', 'price', 'status', 'created_at', 'updated_at')
      .where({ id })
      .first();

    res.json({
      success: true,
      message: '商品更新成功',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: '更新商品时发生错误'
    });
  }
}

/**
 * 删除商品
 * DELETE /api/products/:id
 */
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    // 检查商品是否存在
    const existingProduct = await db('products').where({ id }).first();

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }

    await db('products').where({ id }).del();

    res.json({
      success: true,
      message: '商品删除成功'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: '删除商品时发生错误'
    });
  }
}

/**
 * 获取公开商品详情（不需要认证）
 * GET /api/products/public/:id
 */
async function getPublicProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await db('products')
      .select('id', 'name', 'site_code', 'delivery_type', 'stock', 'price', 'status')
      .where({ id })
      .where('status', 'active') // 只返回启用的商品
      .first();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在或已下架'
      });
    }

    // 异步记录访客日志，不阻塞主流程
    recordVisitorLog(req, product).catch(err => {
      console.error('Record visitor log error:', err);
    });

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get public product error:', error);
    res.status(500).json({
      success: false,
      message: '获取商品详情时发生错误'
    });
  }
}

/**
 * 记录访客日志（异步）
 * @param {Object} req - 请求对象
 * @param {Object} product - 商品信息
 */
async function recordVisitorLog(req, product) {
  const now = formatDateTime(new Date());
  
  // 获取客户端IP
  const ip = req.ip || 
             req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             req.connection.remoteAddress || 
             'unknown';
  
  // 获取来源URL
  const refererUrl = req.headers.referer || req.headers.referrer || '直接访问';
  
  await db('visitor_logs').insert({
    site_code: product.site_code || 'MAIN',
    ip: ip,
    product_id: product.id,
    product_name: product.name,
    visit_url: `/h5/product/${product.id}`,
    referer_url: refererUrl,
    created_at: now
  });
}

module.exports = {
  getProducts,
  getProductById,
  getPublicProduct,
  createProduct,
  updateProduct,
  deleteProduct
};

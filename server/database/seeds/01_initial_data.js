const bcrypt = require('bcryptjs');

/**
 * 生成随机字符串
 */
function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成订单号
 */
function generateOrderNo(index) {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  return `ORD${dateStr}${String(index).padStart(4, '0')}`;
}

/**
 * 生成随机IP
 */
function generateRandomIP() {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

/**
 * 获取随机日期（2026年4月）
 */
function getRandomDateInApril2026() {
  const day = Math.floor(Math.random() * 10) + 1; // 1-10号
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  return `2026-04-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
}

exports.seed = async function(knex) {
  // 清空所有表（按依赖顺序）
  await knex('withdrawals').del();
  await knex('commissions').del();
  await knex('vouchers').del();
  await knex('vip_plans').del();
  await knex('visitor_logs').del();
  await knex('delivery_logs').del();
  await knex('orders').del();
  await knex('products').del();
  await knex('settings').del();
  await knex('users').del();

  const now = '2026-04-10 12:00:00';

  // 1. 插入用户数据
  const adminPassword = bcrypt.hashSync('admin123', 10);
  const agentPassword = bcrypt.hashSync('agent123', 10);
  
  await knex('users').insert([
    {
      id: 1,
      username: 'admin',
      password: adminPassword,
      role: 'admin',
      vip_status: 'none',
      commission_rate: 0,
      balance: 0,
      total_commission: 0,
      status: 'active',
      site_code: 'MAIN',
      created_at: now,
      updated_at: now
    },
    {
      id: 2,
      username: 'agent1',
      password: agentPassword,
      role: 'agent',
      vip_status: 'active',
      vip_expire_at: '2027-04-10 12:00:00',
      commission_rate: 30,
      balance: 1500.50,
      total_commission: 2500.00,
      status: 'active',
      site_code: 'AGENT01',
      created_at: now,
      updated_at: now
    }
  ]);

  // 2. 插入商品数据（10条PPT相关商品）
  const products = [
    { id: 1, name: '护理述职述廉报告PPT模板', price: 15.00 },
    { id: 2, name: 'ICU谵妄护理PPT课件', price: 20.00 },
    { id: 3, name: '支气管哮喘护理个案PPT', price: 12.00 },
    { id: 4, name: '心力衰竭护理PPT模板', price: 18.00 },
    { id: 5, name: '糖尿病酮症护理个案PPT', price: 25.00 },
    { id: 6, name: '血液透析护理PPT课件', price: 22.00 },
    { id: 7, name: '颈椎病健康宣教PPT', price: 8.00 },
    { id: 8, name: '急诊科护理服务PPT', price: 28.00 },
    { id: 9, name: '护士培训完整PPT套装', price: 30.00 },
    { id: 10, name: '医院感染控制PPT课件', price: 15.00 }
  ];

  await knex('products').insert(products.map(p => ({
    ...p,
    site_code: 'MAIN',
    delivery_type: 'netdisk',
    delivery_content: `https://pan.baidu.com/s/1${generateRandomString(8)}`,
    stock: Math.floor(Math.random() * 100) + 10,
    status: 'active',
    created_at: now,
    updated_at: now
  })));

  // 3. 插入订单数据（20条）
  const orderStatuses = ['pending', 'paid', 'shipped', 'completed'];
  const orders = [];
  for (let i = 1; i <= 20; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    orders.push({
      id: i,
      order_no: generateOrderNo(i),
      product_id: product.id,
      product_name: product.name,
      agent_username: Math.random() > 0.5 ? 'agent1' : null,
      amount: product.price,
      status: status,
      paid_at: status !== 'pending' ? getRandomDateInApril2026() : null,
      created_at: getRandomDateInApril2026()
    });
  }
  await knex('orders').insert(orders);

  // 4. 插入发货记录（15条）
  const paidOrders = orders.filter(o => o.status !== 'pending').slice(0, 15);
  const deliveryLogs = paidOrders.map((order, index) => ({
    id: index + 1,
    order_no: order.order_no,
    content: `百度网盘链接: https://pan.baidu.com/s/1${generateRandomString(8)} 提取码: ${generateRandomString(4)}`,
    status: 'success',
    created_at: order.paid_at
  }));
  await knex('delivery_logs').insert(deliveryLogs);

  // 5. 插入访客记录（50条）
  const referers = ['https://www.google.com', 'https://www.baidu.com', 'https://www.bing.com', 'https://zhihu.com', 'https://weibo.com', ''];
  const visitorLogs = [];
  for (let i = 1; i <= 50; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    visitorLogs.push({
      id: i,
      site_code: 'MAIN',
      ip: generateRandomIP(),
      product_id: product.id,
      product_name: product.name,
      visit_url: `/product/${product.id}`,
      referer_url: referers[Math.floor(Math.random() * referers.length)],
      created_at: getRandomDateInApril2026()
    });
  }
  await knex('visitor_logs').insert(visitorLogs);

  // 6. 插入VIP套餐（2个）
  await knex('vip_plans').insert([
    {
      id: 1,
      name: '年度会员',
      site_code: 'MAIN',
      price: 88.00,
      duration_days: 365,
      status: 'active',
      created_at: now
    },
    {
      id: 2,
      name: '永久会员',
      site_code: 'MAIN',
      price: 178.00,
      duration_days: 99999,
      status: 'active',
      created_at: now
    }
  ]);

  // 7. 插入兑换券（10条）
  const vouchers = [];
  for (let i = 1; i <= 10; i++) {
    vouchers.push({
      id: i,
      code: `VIP${generateRandomString(8).toUpperCase()}`,
      plan_id: Math.random() > 0.5 ? 1 : 2,
      site_code: 'MAIN',
      status: i <= 3 ? 'used' : 'unused',
      used_by: i <= 3 ? 2 : null,
      used_at: i <= 3 ? getRandomDateInApril2026() : null,
      created_at: now
    });
  }
  await knex('vouchers').insert(vouchers);

  // 8. 插入佣金记录（5条）
  const commissions = [];
  for (let i = 1; i <= 5; i++) {
    const order = orders.filter(o => o.agent_username === 'agent1')[i - 1];
    if (order) {
      commissions.push({
        id: i,
        user_id: 2,
        order_no: order.order_no,
        order_amount: order.amount,
        commission_rate: 30,
        commission_amount: order.amount * 0.3,
        status: i <= 3 ? 'settled' : 'pending',
        settled_at: i <= 3 ? getRandomDateInApril2026() : null,
        created_at: order.created_at
      });
    }
  }
  await knex('commissions').insert(commissions);

  // 9. 插入提现记录（3条）
  await knex('withdrawals').insert([
    {
      id: 1,
      user_id: 2,
      amount: 500.00,
      fee: 5.00,
      actual_amount: 495.00,
      qrcode_url: '/uploads/qrcode_1.png',
      status: 'completed',
      created_at: '2026-04-05 10:00:00',
      processed_at: '2026-04-06 14:00:00'
    },
    {
      id: 2,
      user_id: 2,
      amount: 300.00,
      fee: 3.00,
      actual_amount: 297.00,
      qrcode_url: '/uploads/qrcode_2.png',
      status: 'pending',
      created_at: '2026-04-08 16:00:00',
      processed_at: null
    },
    {
      id: 3,
      user_id: 2,
      amount: 200.00,
      fee: 2.00,
      actual_amount: 198.00,
      qrcode_url: '/uploads/qrcode_3.png',
      status: 'pending',
      created_at: '2026-04-09 09:00:00',
      processed_at: null
    }
  ]);

  // 10. 插入系统设置
  await knex('settings').insert([
    { id: 1, key: 'store_name', value: '数字商品自动成交系统', updated_at: now },
    { id: 2, key: 'store_desc', value: '专业提供护理PPT课件、医疗培训资料等数字商品', updated_at: now },
    { id: 3, key: 'store_logo', value: '/uploads/logo.png', updated_at: now },
    { id: 4, key: 'contact_email', value: 'support@example.com', updated_at: now },
    { id: 5, key: 'contact_phone', value: '400-123-4567', updated_at: now },
    { id: 6, key: 'commission_rate_default', value: '20', updated_at: now },
    { id: 7, key: 'withdrawal_min_amount', value: '100', updated_at: now },
    { id: 8, key: 'withdrawal_fee_rate', value: '1', updated_at: now }
  ]);

  console.log('Seed data inserted successfully!');
};

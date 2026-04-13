/**
 * 创建数字商品自动成交系统所有数据表
 */
exports.up = function(knex) {
  return knex.schema
    // 1. users 表 - 用户表
    .createTable('users', table => {
      table.increments('id').primary();
      table.text('username').unique().notNullable();
      table.text('password').notNullable();
      table.text('role').defaultTo('user');
      table.text('vip_status').defaultTo('none');
      table.text('vip_expire_at');
      table.float('commission_rate').defaultTo(0);
      table.float('balance').defaultTo(0);
      table.float('total_commission').defaultTo(0);
      table.text('status').defaultTo('active');
      table.text('site_code');
      table.text('created_at');
      table.text('updated_at');
    })
    // 2. products 表 - 商品表
    .createTable('products', table => {
      table.increments('id').primary();
      table.text('name').notNullable();
      table.text('site_code');
      table.text('delivery_type').defaultTo('netdisk');
      table.text('delivery_content');
      table.integer('stock').defaultTo(-1);
      table.float('price').notNullable();
      table.text('status').defaultTo('active');
      table.text('created_at');
      table.text('updated_at');
    })
    // 3. orders 表 - 订单表
    .createTable('orders', table => {
      table.increments('id').primary();
      table.text('order_no').unique().notNullable();
      table.integer('product_id');
      table.text('product_name');
      table.text('agent_username');
      table.float('amount');
      table.text('status').defaultTo('pending');
      table.text('paid_at');
      table.text('created_at');
    })
    // 4. delivery_logs 表 - 发货记录表
    .createTable('delivery_logs', table => {
      table.increments('id').primary();
      table.text('order_no');
      table.text('content');
      table.text('status').defaultTo('success');
      table.text('created_at');
    })
    // 5. visitor_logs 表 - 访客记录表
    .createTable('visitor_logs', table => {
      table.increments('id').primary();
      table.text('site_code');
      table.text('ip');
      table.integer('product_id');
      table.text('product_name');
      table.text('visit_url');
      table.text('referer_url');
      table.text('created_at');
    })
    // 6. vip_plans 表 - VIP套餐表
    .createTable('vip_plans', table => {
      table.increments('id').primary();
      table.text('name').notNullable();
      table.text('site_code');
      table.float('price').notNullable();
      table.integer('duration_days').notNullable();
      table.text('status').defaultTo('active');
      table.text('created_at');
    })
    // 7. vouchers 表 - 兑换券表
    .createTable('vouchers', table => {
      table.increments('id').primary();
      table.text('code').unique().notNullable();
      table.integer('plan_id');
      table.text('site_code');
      table.text('status').defaultTo('unused');
      table.integer('used_by');
      table.text('used_at');
      table.text('created_at');
    })
    // 8. commissions 表 - 佣金表
    .createTable('commissions', table => {
      table.increments('id').primary();
      table.integer('user_id');
      table.text('order_no');
      table.float('order_amount');
      table.float('commission_rate');
      table.float('commission_amount');
      table.text('status').defaultTo('pending');
      table.text('settled_at');
      table.text('created_at');
    })
    // 9. withdrawals 表 - 提现表
    .createTable('withdrawals', table => {
      table.increments('id').primary();
      table.integer('user_id');
      table.float('amount');
      table.float('fee').defaultTo(0);
      table.float('actual_amount');
      table.text('qrcode_url');
      table.text('status').defaultTo('pending');
      table.text('created_at');
      table.text('processed_at');
    })
    // 10. settings 表 - 系统设置表
    .createTable('settings', table => {
      table.increments('id').primary();
      table.text('key').unique().notNullable();
      table.text('value');
      table.text('updated_at');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('settings')
    .dropTableIfExists('withdrawals')
    .dropTableIfExists('commissions')
    .dropTableIfExists('vouchers')
    .dropTableIfExists('vip_plans')
    .dropTableIfExists('visitor_logs')
    .dropTableIfExists('delivery_logs')
    .dropTableIfExists('orders')
    .dropTableIfExists('products')
    .dropTableIfExists('users');
};

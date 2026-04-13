const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config');

// 初始化Express应用
const app = express();

// 中间件配置
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 确保上传目录存在
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

// 静态文件服务
app.use('/uploads', express.static(config.uploadDir));

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 路由挂载点
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
// app.use('/api/delivery', require('./routes/delivery'));
// app.use('/api/visitors', require('./routes/visitors'));
// app.use('/api/vip-plans', require('./routes/vipPlans'));
// app.use('/api/vouchers', require('./routes/vouchers'));
// app.use('/api/commissions', require('./routes/commissions'));
// app.use('/api/withdrawals', require('./routes/withdrawals'));
// app.use('/api/settings', require('./routes/settings'));
app.use('/api/dashboard', require('./routes/dashboard'));

// 404处理
app.use((req, res) => {
  res.status(404).json({ success: false, message: '接口不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 数据库迁移和种子函数
async function runMigrationsAndSeeds() {
  try {
    const knex = require('knex')(require('./knexfile').development);
    
    console.log('Running database migrations...');
    await knex.migrate.latest();
    console.log('Migrations completed successfully!');
    
    console.log('Running database seeds...');
    await knex.seed.run();
    console.log('Seeds completed successfully!');
    
    await knex.destroy();
  } catch (error) {
    console.error('Migration/Seed error:', error);
    // 不阻止服务器启动，但记录错误
  }
}

// 启动服务器
async function startServer() {
  // 先运行迁移和种子
  await runMigrationsAndSeeds();
  
  // 启动监听
  app.listen(config.port, () => {
    console.log(`=================================`);
    console.log(`Server is running on port ${config.port}`);
    console.log(`API URL: http://localhost:${config.port}`);
    console.log(`Upload directory: ${config.uploadDir}`);
    console.log(`Database path: ${config.dbPath}`);
    console.log(`=================================`);
  });
}

startServer();

module.exports = app;

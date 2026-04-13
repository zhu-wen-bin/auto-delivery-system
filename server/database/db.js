const path = require('path');
const fs = require('fs');
const config = require('../config');

// 尝试使用真实数据库，如果失败则使用模拟数据库
let knex;

try {
  // 确保数据目录存在
  const dbDir = path.dirname(config.dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // 使用 knex 创建数据库连接
  knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: config.dbPath
    },
    useNullAsDefault: true
  });

  console.log('SQLite database connected:', config.dbPath);
} catch (error) {
  console.warn('Failed to connect to SQLite, using mock database:', error.message);
  knex = require('./db-mock');
}

module.exports = knex;

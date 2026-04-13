#!/bin/bash

# 阿里云部署 - 后端启动脚本
# 在 /var/www/auto-delivery 目录执行

cd /var/www/auto-delivery/server

# 1. 安装依赖
npm install

# 2. 创建数据目录
mkdir -p data
mkdir -p uploads

# 3. 设置环境变量
export NODE_ENV=production
export PORT=3000
export JWT_SECRET=your-secret-key-here
export CORS_ORIGIN=*

# 4. 使用 PM2 启动后端
pm2 start app.js --name "auto-delivery-api"

# 5. 保存 PM2 配置
pm2 save
pm2 startup

echo "后端部署完成！"

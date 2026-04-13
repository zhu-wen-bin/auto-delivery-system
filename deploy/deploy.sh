#!/bin/bash

# 阿里云部署脚本
# 在服务器上执行

# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. 安装 Nginx
sudo apt install -y nginx

# 4. 安装 PM2（进程管理器）
sudo npm install -g pm2

# 5. 创建项目目录
sudo mkdir -p /var/www/auto-delivery
cd /var/www/auto-delivery

# 6. 克隆代码（或者手动上传）
# git clone https://github.com/zhu-wen-bin/auto-delivery-system.git .

echo "请手动上传代码到 /var/www/auto-delivery 目录"
echo "然后继续执行后续步骤"

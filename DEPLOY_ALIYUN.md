# 阿里云部署指南

## 方案概述

| 项目 | 配置 |
|------|------|
| 服务器 | 阿里云 ECS |
| 系统 | Ubuntu 22.04 LTS |
| 前端 | Nginx 静态托管 |
| 后端 | Node.js + PM2 |
| 数据库 | SQLite |

---

## 第一步：购买阿里云服务器

### 1.1 选择配置
- **实例规格**：2核4G（推荐）或 1核2G（最低）
- **系统**：Ubuntu 22.04 LTS
- **带宽**：3-5Mbps（按流量计费更便宜）
- **地域**：选择离你用户最近的（如华东1、华南1）

### 1.2 安全组配置
开放以下端口：
- 22（SSH）
- 80（HTTP）
- 443（HTTPS）
- 3000（后端API，可选）

---

## 第二步：连接服务器

使用 SSH 连接：
```bash
ssh root@你的服务器IP
```

---

## 第三步：安装环境

在服务器上执行：

```bash
# 1. 更新系统
apt update && apt upgrade -y

# 2. 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# 3. 验证安装
node -v  # 应该显示 v18.x.x
npm -v   # 应该显示 9.x.x

# 4. 安装 Nginx
apt install -y nginx

# 5. 安装 PM2
npm install -g pm2
```

---

## 第四步：上传代码

### 方法 1：使用 Git（推荐）
```bash
cd /var/www
mkdir auto-delivery
cd auto-delivery
git clone https://github.com/zhu-wen-bin/auto-delivery-system.git .
```

### 方法 2：使用 SCP / FTP
1. 在本地构建前端：
   ```bash
   cd client
   npm run build
   ```

2. 上传文件到服务器：
   - 前端：`client/dist` → `/var/www/auto-delivery/client/dist`
   - 后端：`server` → `/var/www/auto-delivery/server`

---

## 第五步：部署后端

```bash
cd /var/www/auto-delivery/server

# 1. 安装依赖
npm install

# 2. 创建数据目录
mkdir -p data uploads

# 3. 创建环境变量文件
cat > .env << EOF
NODE_ENV=production
PORT=3000
JWT_SECRET=your-random-secret-key-here
CORS_ORIGIN=*
DB_PATH=/var/www/auto-delivery/data/app.db
UPLOAD_DIR=/var/www/auto-delivery/server/uploads
EOF

# 4. 使用 PM2 启动
pm2 start app.js --name "auto-delivery-api"

# 5. 保存配置
pm2 save
pm2 startup
```

---

## 第六步：配置 Nginx

```bash
# 1. 复制配置文件
cp /var/www/auto-delivery/deploy/nginx.conf /etc/nginx/sites-available/auto-delivery

# 2. 修改配置
nano /etc/nginx/sites-available/auto-delivery
# 把 server_name 改成你的域名或IP

# 3. 启用配置
ln -s /etc/nginx/sites-available/auto-delivery /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# 4. 测试配置
nginx -t

# 5. 重启 Nginx
systemctl restart nginx
```

---

## 第七步：配置 HTTPS（SSL证书）

使用 Certbot 免费证书：

```bash
# 1. 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 2. 申请证书
certbot --nginx -d your-domain.com

# 3. 自动续期（默认已配置）
```

---

## 第八步：测试访问

浏览器访问：
- 前端：`http://你的服务器IP` 或 `https://你的域名`
- 后端API：`http://你的服务器IP/api/health`

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `pm2 status` | 查看后端状态 |
| `pm2 logs` | 查看后端日志 |
| `pm2 restart auto-delivery-api` | 重启后端 |
| `nginx -t` | 测试 Nginx 配置 |
| `systemctl restart nginx` | 重启 Nginx |

---

## 费用预估

| 配置 | 月费用 |
|------|--------|
| 1核2G + 3Mbps | 约 50-80 元 |
| 2核4G + 5Mbps | 约 100-150 元 |

---

## 备份数据

```bash
# 备份数据库
cp /var/www/auto-delivery/data/app.db /backup/app.db.$(date +%Y%m%d)

# 备份上传文件
tar -czf /backup/uploads.$(date +%Y%m%d).tar.gz /var/www/auto-delivery/server/uploads/
```

---

## 故障排查

### 1. 后端无法启动
```bash
pm2 logs
```

### 2. 前端无法访问
```bash
systemctl status nginx
nginx -t
```

### 3. 权限问题
```bash
chown -R www-data:www-data /var/www/auto-delivery
```

---

**部署完成！** 🎉

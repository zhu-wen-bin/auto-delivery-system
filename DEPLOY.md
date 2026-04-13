# Vercel + Railway 部署指南

## 项目结构说明

```
auto-delivery-system/
├── client/          # Vue3 前端项目
│   ├── vercel.json  # Vercel 部署配置
│   └── vite.config.js
├── server/          # Express 后端项目
│   ├── railway.toml # Railway 部署配置
│   └── knexfile.js
└── data/            # SQLite 数据库目录
```

---

## 第一步：准备代码仓库

### 1. 初始化 Git 仓库

```bash
cd auto-delivery-system
git init
git add .
git commit -m "Initial commit for deployment"
```

### 2. 创建 GitHub 仓库并推送

```bash
# 在 GitHub 上创建新仓库，然后执行：
git remote add origin https://github.com/你的用户名/auto-delivery-system.git
git branch -M main
git push -u origin main
```

---

## 第二步：部署后端到 Railway

### 1. 注册/登录 Railway

- 访问 https://railway.app
- 使用 GitHub 账号登录

### 2. 创建新项目

1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择你的 `auto-delivery-system` 仓库
4. 点击 "Add Variables" 添加环境变量

### 3. 配置环境变量

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 生产环境标识 |
| `JWT_SECRET` | 随机字符串 | JWT 密钥，建议 32 位以上随机字符 |
| `CORS_ORIGIN` | 前端地址 | 先填 `*`，部署前端后再更新 |
| `DB_PATH` | `/app/data/app.db` | 数据库文件路径 |

### 4. 修改启动目录

1. 在项目设置中，找到 "Settings"
2. 设置 "Root Directory" 为 `server`
3. 点击 "Deploy" 重新部署

### 5. 获取后端地址

部署成功后，在 "Settings" → "Domains" 中可以看到你的后端地址：
- 例如：`https://auto-delivery-api.up.railway.app`

**记下这个地址，部署前端时需要用到！**

---

## 第三步：部署前端到 Vercel

### 1. 注册/登录 Vercel

- 访问 https://vercel.com
- 使用 GitHub 账号登录

### 2. 导入项目

1. 点击 "Add New Project"
2. 选择你的 `auto-delivery-system` 仓库
3. 点击 "Import"

### 3. 配置项目

| 配置项 | 值 |
|--------|-----|
| Framework Preset | Vite |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 4. 添加环境变量

点击 "Environment Variables"，添加：

| 变量名 | 值 |
|--------|-----|
| `VITE_API_URL` | 你的 Railway 后端地址 |

例如：`VITE_API_URL=https://auto-delivery-api.up.railway.app`

### 5. 部署

点击 "Deploy" 开始部署。

部署成功后，你会获得一个 Vercel 域名：
- 例如：`https://auto-delivery-system.vercel.app`

---

## 第四步：更新 CORS 配置

回到 Railway，更新环境变量：

| 变量名 | 值 |
|--------|-----|
| `CORS_ORIGIN` | 你的 Vercel 前端地址 |

例如：`CORS_ORIGIN=https://auto-delivery-system.vercel.app`

点击 "Redeploy" 重新部署后端。

---

## 第五步：验证部署

### 1. 测试后端 API

浏览器访问：`https://你的后端地址/health`

应该返回：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. 测试前端页面

访问你的 Vercel 地址，应该能看到登录页面。

### 3. 测试完整流程

使用默认账号登录：
- 管理员：admin / admin123
- 商户：merchant / merchant123

---

## 常见问题

### 1. 数据库文件丢失

Railway 是临时文件系统，免费版每次部署会重置数据。

**解决方案：**
- 方案 A：升级到 Railway Pro（付费）
- 方案 B：使用 Railway 的 Volume 功能（付费）
- 方案 C：迁移到 MySQL/PostgreSQL 数据库

### 2. CORS 错误

检查 Railway 的 `CORS_ORIGIN` 环境变量是否正确设置为 Vercel 地址。

### 3. 前端无法连接后端

检查 Vercel 的 `VITE_API_URL` 环境变量是否正确设置为 Railway 地址。

---

## 自定义域名（可选）

### Vercel 自定义域名

1. 在 Vercel 项目设置中，点击 "Domains"
2. 添加你的域名
3. 按提示配置 DNS

### Railway 自定义域名

1. 在 Railway 项目设置中，点击 "Settings" → "Domains"
2. 添加你的域名
3. 按提示配置 DNS

---

## 部署完成！

现在你的数字商品自动成交系统已经成功部署到线上环境了！

前端地址：https://你的vercel域名.vercel.app
后端地址：https://你的railway域名.up.railway.app

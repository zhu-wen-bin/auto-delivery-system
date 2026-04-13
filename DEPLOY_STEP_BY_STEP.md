# Vercel + Railway 部署详细步骤指南

## 准备工作

### 1. 需要的账号
- [ ] GitHub 账号（https://github.com）
- [ ] Vercel 账号（用 GitHub 登录）
- [ ] Railway 账号（用 GitHub 登录）

---

## 第一步：推送代码到 GitHub

### 1.1 打开终端，进入项目目录

```powershell
cd c:\Users\hp\Desktop\测试\python\auto-delivery-system
```

### 1.2 初始化 Git 仓库

```powershell
git init
```

**预期输出：**
```
Initialized empty Git repository in C:/Users/hp/Desktop/测试/python/auto-delivery-system/.git/
```

### 1.3 添加所有文件

```powershell
git add .
```

### 1.4 提交代码

```powershell
git commit -m "Initial commit for deployment"
```

**预期输出：**
```
[main (root-commit) xxxxxxx] Initial commit for deployment
 xx files changed, xxxx insertions(+)
```

### 1.5 创建 GitHub 仓库

1. 打开 https://github.com/new
2. 填写 Repository name: `auto-delivery-system`
3. 选择 Public（免费）
4. 点击 **Create repository**

### 1.6 连接并推送代码

```powershell
git remote add origin https://github.com/你的用户名/auto-delivery-system.git
git branch -M main
git push -u origin main
```

**预期输出：**
```
Enumerating objects: xx, done.
Counting objects: 100% (xx/xx), done.
Delta compression using up to x threads
Compressing objects: 100% (xx/xx), done.
Writing objects: 100% (xx/xx), xx KiB | xx MiB/s, done.
Total xx (delta x), reused x (delta x), pack-reused x
To https://github.com/你的用户名/auto-delivery-system.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

✅ **完成！** 代码已推送到 GitHub

---

## 第二步：部署后端到 Railway

### 2.1 登录 Railway

1. 打开 https://railway.app
2. 点击 **Login** → **Continue with GitHub**
3. 授权 Railway 访问你的 GitHub 账号

### 2.2 创建新项目

1. 登录后，点击 **New Project**
2. 选择 **Deploy from GitHub repo**
3. 在列表中找到并选择 `auto-delivery-system`
4. 点击 **Add Variables**

### 2.3 配置环境变量

点击 **New Variable**，逐个添加：

| 变量名 | 值 |
|--------|-----|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `your-random-secret-key-2024` |
| `CORS_ORIGIN` | `*` |
| `DB_PATH` | `/app/data/app.db` |

**注意：**
- `JWT_SECRET` 请替换为随机字符串（建议 32 位以上）
- `CORS_ORIGIN` 先填 `*`，后面再改

### 2.4 设置启动目录

1. 点击项目左侧的 **Settings**
2. 找到 **Root Directory**
3. 输入：`server`
4. 点击 **Save**

### 2.5 部署

1. 点击 **Deploy** 按钮
2. 等待部署完成（约 2-3 分钟）

### 2.6 获取后端地址

1. 部署成功后，点击 **Settings**
2. 找到 **Domains**
3. 复制你的域名，例如：
   ```
   https://auto-delivery-api.up.railway.app
   ```

📋 **记录下来，下一步要用！**

✅ **完成！** 后端已部署

---

## 第三步：部署前端到 Vercel

### 3.1 登录 Vercel

1. 打开 https://vercel.com
2. 点击 **Sign Up** → **Continue with GitHub**
3. 授权 Vercel 访问你的 GitHub 账号

### 3.2 导入项目

1. 点击 **Add New Project**
2. 在 **Import Git Repository** 中找到 `auto-delivery-system`
3. 点击 **Import**

### 3.3 配置项目

填写以下配置：

| 配置项 | 值 |
|--------|-----|
| Framework Preset | `Vite` |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 3.4 添加环境变量

1. 展开 **Environment Variables**
2. 点击 **Add** 添加变量：

| 变量名 | 值 |
|--------|-----|
| `VITE_API_URL` | 你的 Railway 地址 |

例如：
```
VITE_API_URL=https://auto-delivery-api.up.railway.app
```

### 3.5 部署

1. 点击 **Deploy** 按钮
2. 等待部署完成（约 1-2 分钟）

### 3.6 获取前端地址

部署成功后，你会看到：
```
🎉 Congratulations! Your project is live.
https://auto-delivery-system.vercel.app
```

📋 **记录下来！**

✅ **完成！** 前端已部署

---

## 第四步：更新 CORS 配置

### 4.1 回到 Railway

1. 打开 https://railway.app
2. 进入你的项目

### 4.2 更新环境变量

1. 点击 **Variables**
2. 找到 `CORS_ORIGIN`
3. 点击编辑，将值从 `*` 改为你的 Vercel 地址：
   ```
   https://auto-delivery-system.vercel.app
   ```
4. 点击 **Save**

### 4.3 重新部署

1. 点击 **Deploy** 重新部署
2. 等待部署完成

✅ **完成！** CORS 配置已更新

---

## 第五步：验证部署

### 5.1 测试后端 API

浏览器访问：
```
https://你的railway地址/health
```

**预期结果：**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 5.2 测试前端页面

浏览器访问你的 Vercel 地址：
```
https://你的vercel地址
```

**预期结果：** 看到登录页面

### 5.3 测试登录

使用默认账号登录：
- **管理员**：admin / admin123
- **商户**：merchant / merchant123

**预期结果：** 成功登录并跳转到仪表盘

✅ **全部完成！**

---

## 故障排查

### 问题 1：前端显示 "网络错误"

**原因：** 前端无法连接后端

**解决：**
1. 检查 Vercel 的 `VITE_API_URL` 是否正确
2. 确保 Railway 后端已部署成功
3. 检查浏览器控制台（F12）查看具体错误

### 问题 2：CORS 错误

**浏览器控制台显示：**
```
Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy
```

**解决：**
1. 检查 Railway 的 `CORS_ORIGIN` 是否设置为 Vercel 地址
2. 确保没有拼写错误
3. 重新部署后端

### 问题 3：数据库数据丢失

**原因：** Railway 免费版是临时文件系统

**解决：**
- 方案 A：升级到 Railway Pro（付费）
- 方案 B：使用 Railway Volume（付费）
- 方案 C：迁移到 MySQL/PostgreSQL

### 问题 4：部署失败

**查看日志：**
1. 在 Railway/Vercel 控制台点击 **Logs**
2. 查看错误信息
3. 根据错误提示修复问题

---

## 部署信息汇总

| 项目 | 地址 |
|------|------|
| 前端 | https://你的vercel地址 |
| 后端 | https://你的railway地址 |
| GitHub | https://github.com/你的用户名/auto-delivery-system |

| 账号 | 密码 |
|------|------|
| admin | admin123 |
| merchant | merchant123 |

---

## 后续维护

### 更新代码后重新部署

```powershell
git add .
git commit -m "Update something"
git push origin main
```

推送后，Railway 和 Vercel 会自动重新部署！

---

**🎉 恭喜你！部署完成！**

# Cloudflare Pages + D1 部署指南

## 🎯 优势

- ✅ **完整功能**：支持登录、编辑、数据库操作
- ✅ **全球CDN**：Cloudflare的边缘网络，速度极快
- ✅ **免费额度**：D1数据库免费100,000次读取/日
- ✅ **自动备份**：云数据库，数据安全
- ✅ **零维护**：无需服务器管理

## 📋 部署步骤

### 1. 创建Cloudflare D1数据库

```bash
# 安装Wrangler CLI
npm install -g wrangler

# 登录Cloudflare
wrangler login

# 创建D1数据库
wrangler d1 create navigation-db
```

### 2. 配置数据库ID

复制创建后的数据库ID，更新 `wrangler.toml` 文件：

```toml
[[env.production.d1_databases]]
binding = "DB"
database_name = "navigation-db"
database_id = "你的数据库ID"  # 替换这里
```

### 3. 初始化数据库表

```bash
# 执行数据库初始化
wrangler d1 execute navigation-db --file=./scripts/d1-init.sql
```

### 4. 部署到Cloudflare Pages

#### 方法一：连接GitHub（推荐）

1. 推送代码到GitHub的 `cloudflare-d1` 分支
2. 访问 [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
3. 点击 "Create a project" → "Connect to Git"
4. 选择您的仓库和 `cloudflare-d1` 分支
5. 配置构建设置：
   - **Framework preset**: Next.js (Static Export)
   - **Build command**: `npm run build`
   - **Output directory**: `out`
6. 在 **Environment variables** 添加：
   - `NODE_VERSION`: `18`
7. 在 **Functions** 标签页绑定D1数据库：
   - Variable name: `DB`
   - D1 database: `navigation-db`

#### 方法二：直接部署

```bash
# 构建项目
npm run build

# 部署到Cloudflare Pages
wrangler pages deploy out --project-name=navigation-site
```

## 🔐 默认登录信息

- **用户名**: `admin`
- **密码**: `admin123`

## 📝 数据库管理

```bash
# 查看数据库信息
wrangler d1 info navigation-db

# 执行SQL查询
wrangler d1 execute navigation-db --command="SELECT * FROM users"

# 备份数据库
wrangler d1 export navigation-db --output=backup.sql
```

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 启动本地开发（需要配置本地D1）
npm run dev
```

## 🚀 部署成功后

部署完成后，您将获得：

- ✅ 完整功能的导航站
- ✅ 全球CDN加速
- ✅ 自动HTTPS
- ✅ 无限带宽
- ✅ 数据持久化

## 📞 获取帮助

如果遇到问题：

1. 检查Cloudflare Pages构建日志
2. 确认D1数据库绑定正确
3. 验证环境变量配置
4. 查看Wrangler文档：https://developers.cloudflare.com/workers/wrangler/ 
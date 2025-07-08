# 导航站项目 - 部署指南

## 🏠 本地开发版本

**当前分支**: `dev-full-features`  
**功能**: 完整功能，包含SQLite数据库、用户认证、API路由  
**登录信息**: admin / admin123

## 🌐 部署方案

### 方案一：Vercel + Supabase（推荐）

**优势**: 
- ✅ 支持完整API功能
- ✅ 云数据库，数据持久化  
- ✅ 自动部署，零配置
- ✅ 免费额度充足

**步骤**:
1. 注册 [Supabase](https://supabase.com) 账户
2. 创建新项目，获取数据库连接信息
3. 推送代码到GitHub
4. 在 [Vercel](https://vercel.com) 导入项目
5. 配置环境变量

### 方案二：Railway 部署

**优势**:
- ✅ 支持SQLite文件数据库
- ✅ 零配置部署
- ✅ 自动备份

### 方案三：传统VPS部署

**优势**:
- ✅ 完全控制
- ✅ 使用现有SQLite数据库
- ✅ 性能最佳

## 📝 分支说明

- `main`: 静态版本，仅用于Cloudflare Pages演示
- `dev-full-features`: 完整功能版本，推荐用于实际使用

## 🛠️ 快速开始

```bash
# 克隆项目
git clone https://github.com/你的用户名/navigation-site.git
cd navigation-site

# 切换到完整功能分支
git checkout dev-full-features

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 🔐 默认账户

- 用户名: `admin`
- 密码: `admin123` 
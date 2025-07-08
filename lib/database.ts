import Database from "better-sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "navigation.db")
const db = new Database(dbPath)

// 启用外键约束
db.pragma("foreign_keys = ON")

// 数据库初始化
export function initDatabase() {
  // 创建用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 创建分类表
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 创建网站表
  db.exec(`
    CREATE TABLE IF NOT EXISTS websites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      icon_type TEXT DEFAULT 'favicon',
      icon_value TEXT,
      clicks INTEGER DEFAULT 0,
      is_recommended BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(name, url)
    )
  `)

  // 为现有数据库添加唯一性索引（如果不存在）
  try {
    db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_website_unique 
      ON websites (name, url)
    `)
  } catch (error) {
    // 索引已存在或其他错误，忽略
  }

  // 插入默认数据
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (username, password, role) 
    VALUES (?, ?, ?)
  `)
  insertUser.run("admin", "admin123", "admin")

  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (name) VALUES (?)
  `)
  const defaultCategories = [
    "开发工具",
    "设计工具",
    "效率工具",
    "安全工具",
    "学习资源",
    "社交工具",
    "娱乐工具",
    "购物工具",
  ]
  defaultCategories.forEach((category) => {
    insertCategory.run(category)
  })

  const insertWebsite = db.prepare(`
    INSERT OR IGNORE INTO websites (name, url, category, description, icon_type, icon_value, clicks, is_recommended) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const defaultWebsites = [
    ["GitHub", "https://github.com", "开发工具", "全球最大的代码托管平台", "favicon", "https://github.com", 1250, 1],
    ["Figma", "https://figma.com", "设计工具", "协作式界面设计工具", "favicon", "https://figma.com", 980, 1],
    ["Notion", "https://notion.so", "效率工具", "全能的工作空间和笔记工具", "favicon", "https://notion.so", 1100, 1],
    ["Vercel", "https://vercel.com", "开发工具", "现代化的前端部署平台", "favicon", "https://vercel.com", 750, 1],
    [
      "Supabase",
      "https://supabase.com",
      "开发工具",
      "开源的 Firebase 替代方案",
      "favicon",
      "https://supabase.com",
      650,
      0,
    ],
    ["1Password", "https://1password.com", "安全工具", "安全的密码管理器", "lucide", "Shield", 420, 0],
    [
      "Dribbble",
      "https://dribbble.com",
      "设计工具",
      "设计师作品展示平台",
      "favicon",
      "https://dribbble.com",
      380,
      0,
    ],
    [
      "Stack Overflow",
      "https://stackoverflow.com",
      "学习资源",
      "程序员问答社区",
      "favicon",
      "https://stackoverflow.com",
      890,
      0,
    ],
  ]

  defaultWebsites.forEach((website) => {
    insertWebsite.run(...website)
  })
}

// 网站相关操作
export const websiteQueries = {
  getAll: db.prepare("SELECT * FROM websites ORDER BY created_at DESC"),
  getById: db.prepare("SELECT * FROM websites WHERE id = ?"),
  getRecommended: db.prepare("SELECT * FROM websites WHERE is_recommended = 1 ORDER BY clicks DESC"),
  create: db.prepare(`
    INSERT INTO websites (name, url, category, description, icon_type, icon_value, clicks, is_recommended) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE websites 
    SET name = ?, url = ?, category = ?, description = ?, icon_type = ?, icon_value = ?, is_recommended = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `),
  updateClicks: db.prepare("UPDATE websites SET clicks = clicks + 1 WHERE id = ?"),
  delete: db.prepare("DELETE FROM websites WHERE id = ?"),
  toggleRecommended: db.prepare("UPDATE websites SET is_recommended = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"),
}

// 分类相关操作
export const categoryQueries = {
  getAll: db.prepare("SELECT * FROM categories ORDER BY name"),
  getById: db.prepare("SELECT * FROM categories WHERE id = ?"),
  create: db.prepare("INSERT INTO categories (name) VALUES (?)"),
  update: db.prepare("UPDATE categories SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"),
  delete: db.prepare("DELETE FROM categories WHERE id = ?"),
  getByName: db.prepare("SELECT * FROM categories WHERE name = ?"),
}

// 用户相关操作
export const userQueries = {
  getAll: db.prepare("SELECT id, username, role, created_at FROM users"),
  getByUsername: db.prepare("SELECT * FROM users WHERE username = ?"),
  create: db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)"),
  update: db.prepare(
    "UPDATE users SET username = ?, password = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
  ),
  delete: db.prepare("DELETE FROM users WHERE id = ?"),
}

export default db

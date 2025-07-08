import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'database.db')
const db = new Database(dbPath)

// 确保数据库表存在
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT DEFAULT '',
    icon_type TEXT DEFAULT 'favicon',
    icon_value TEXT DEFAULT '',
    clicks INTEGER DEFAULT 0,
    is_recommended INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

// 插入默认管理员用户（如果不存在）
const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin')
if (!adminUser) {
  db.prepare('INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)').run('admin', 'admin123', 1)
}

// 插入默认分类（如果不存在）
const defaultCategories = ['搜索引擎', '社交媒体', '开发工具', '设计资源', '在线工具']
for (const categoryName of defaultCategories) {
  const existing = db.prepare('SELECT * FROM categories WHERE name = ?').get(categoryName)
  if (!existing) {
    db.prepare('INSERT INTO categories (name) VALUES (?)').run(categoryName)
  }
}

// 插入默认网站（如果不存在）
const defaultWebsites = [
  {
    name: 'Google',
    url: 'https://www.google.com',
    category: '搜索引擎',
    description: '全球最大的搜索引擎',
    icon_type: 'favicon',
    icon_value: 'https://www.google.com',
    is_recommended: 1
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    category: '开发工具', 
    description: '代码托管和协作平台',
    icon_type: 'favicon',
    icon_value: 'https://github.com',
    is_recommended: 1
  },
  {
    name: 'Figma',
    url: 'https://www.figma.com',
    category: '设计资源',
    description: '协作设计工具',
    icon_type: 'favicon',
    icon_value: 'https://www.figma.com',
    is_recommended: 1
  }
]

for (const website of defaultWebsites) {
  const existing = db.prepare('SELECT * FROM websites WHERE url = ?').get(website.url)
  if (!existing) {
    db.prepare(`
      INSERT INTO websites (name, url, category, description, icon_type, icon_value, is_recommended) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      website.name,
      website.url, 
      website.category,
      website.description,
      website.icon_type,
      website.icon_value,
      website.is_recommended
    )
  }
}

export { db }
export default db 
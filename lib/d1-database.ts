// Cloudflare D1 数据库配置
export interface Env {
  DB: D1Database
}

// 数据库初始化SQL
export const INIT_SQL = `
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建网站表
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

-- 插入默认管理员用户
INSERT OR IGNORE INTO users (username, password, is_admin) VALUES ('admin', 'admin123', 1);

-- 插入默认分类
INSERT OR IGNORE INTO categories (name) VALUES 
  ('搜索引擎'),
  ('社交媒体'),
  ('开发工具'),
  ('设计资源'),
  ('在线工具');

-- 插入默认网站
INSERT OR IGNORE INTO websites (name, url, category, description, icon_type, icon_value, is_recommended) VALUES
  ('Google', 'https://www.google.com', '搜索引擎', '全球最大的搜索引擎', 'favicon', 'https://www.google.com', 1),
  ('GitHub', 'https://github.com', '开发工具', '代码托管和协作平台', 'favicon', 'https://github.com', 1),
  ('Figma', 'https://www.figma.com', '设计资源', '协作设计工具', 'favicon', 'https://www.figma.com', 1);
`;

// 数据库操作类
export class D1DatabaseManager {
  constructor(private db: D1Database) {}

  // 初始化数据库
  async init() {
    try {
      await this.db.exec(INIT_SQL);
      console.log('数据库初始化成功');
    } catch (error) {
      console.error('数据库初始化失败:', error);
      throw error;
    }
  }

  // 用户相关操作
  async getUser(username: string, password: string) {
    return await this.db.prepare('SELECT * FROM users WHERE username = ? AND password = ?')
      .bind(username, password)
      .first();
  }

  // 网站相关操作
  async getAllWebsites() {
    const result = await this.db.prepare('SELECT * FROM websites ORDER BY created_at DESC').all();
    return result.results;
  }

  async getRecommendedWebsites() {
    const result = await this.db.prepare('SELECT * FROM websites WHERE is_recommended = 1 ORDER BY created_at DESC').all();
    return result.results;
  }

  async createWebsite(data: any) {
    const { name, url, category, description, iconType, iconValue, isRecommended } = data;
    
    const result = await this.db.prepare(`
      INSERT INTO websites (name, url, category, description, icon_type, icon_value, is_recommended)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(name, url, category, description, iconType, iconValue, isRecommended ? 1 : 0).run();

    if (result.success) {
      return await this.db.prepare('SELECT * FROM websites WHERE id = ?')
        .bind(result.meta.last_row_id).first();
    }
    throw new Error('创建网站失败');
  }

  async updateWebsite(id: number, data: any) {
    const fields = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'is_recommended') {
          fields.push('is_recommended = ?');
          values.push(value ? 1 : 0);
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
    });

    if (fields.length === 0) return null;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const sql = `UPDATE websites SET ${fields.join(', ')} WHERE id = ?`;
    const result = await this.db.prepare(sql).bind(...values).run();

    if (result.success) {
      return await this.db.prepare('SELECT * FROM websites WHERE id = ?').bind(id).first();
    }
    throw new Error('更新网站失败');
  }

  async deleteWebsite(id: number) {
    const result = await this.db.prepare('DELETE FROM websites WHERE id = ?').bind(id).run();
    return result.success;
  }

  // 分类相关操作
  async getAllCategories() {
    const result = await this.db.prepare('SELECT * FROM categories ORDER BY created_at ASC').all();
    return result.results;
  }

  async createCategory(name: string) {
    const result = await this.db.prepare('INSERT INTO categories (name) VALUES (?)').bind(name).run();
    
    if (result.success) {
      return await this.db.prepare('SELECT * FROM categories WHERE id = ?')
        .bind(result.meta.last_row_id).first();
    }
    throw new Error('创建分类失败');
  }

  async updateCategory(id: number, name: string) {
    const result = await this.db.prepare('UPDATE categories SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(name, id).run();
    
    if (result.success) {
      return await this.db.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first();
    }
    throw new Error('更新分类失败');
  }

  async deleteCategory(id: number) {
    const result = await this.db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
    return result.success;
  }
} 
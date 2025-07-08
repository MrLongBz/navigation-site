-- Cloudflare D1 数据库初始化脚本

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
  ('Figma', 'https://www.figma.com', '设计资源', '协作设计工具', 'favicon', 'https://www.figma.com', 1),
  ('ChatGPT', 'https://chat.openai.com', '在线工具', 'AI对话助手', 'favicon', 'https://chat.openai.com', 0),
  ('Stack Overflow', 'https://stackoverflow.com', '开发工具', '程序员问答社区', 'favicon', 'https://stackoverflow.com', 0); 
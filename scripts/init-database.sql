-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
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
    description TEXT,
    icon_type TEXT DEFAULT 'favicon',
    icon_value TEXT,
    clicks INTEGER DEFAULT 0,
    is_recommended BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category) REFERENCES categories(name)
);

-- 插入默认管理员用户
INSERT OR IGNORE INTO users (username, password, role) 
VALUES ('admin', 'admin123', 'admin');

-- 插入默认分类
INSERT OR IGNORE INTO categories (name) VALUES 
('开发工具'),
('设计工具'),
('效率工具'),
('安全工具'),
('学习资源'),
('社交工具'),
('娱乐工具'),
('购物工具');

-- 插入默认网站数据
INSERT OR IGNORE INTO websites (name, url, category, description, icon_type, icon_value, clicks, is_recommended) VALUES 
('GitHub', 'https://github.com', '开发工具', '全球最大的代码托管平台', 'favicon', 'https://github.com', 1250, TRUE),
('Figma', 'https://figma.com', '设计工具', '协作式界面设计工具', 'favicon', 'https://figma.com', 980, TRUE),
('Notion', 'https://notion.so', '效率工具', '全能的工作空间和笔记工具', 'favicon', 'https://notion.so', 1100, TRUE),
('Vercel', 'https://vercel.com', '开发工具', '现代化的前端部署平台', 'favicon', 'https://vercel.com', 750, TRUE),
('Supabase', 'https://supabase.com', '开发工具', '开源的 Firebase 替代方案', 'favicon', 'https://supabase.com', 650, FALSE),
('1Password', 'https://1password.com', '安全工具', '安全的密码管理器', 'lucide', 'Shield', 420, FALSE),
('Dribbble', 'https://dribbble.com', '设计工具', '设计师作品展示平台', 'favicon', 'https://dribbble.com', 380, FALSE),
('Stack Overflow', 'https://stackoverflow.com', '学习资源', '程序员问答社区', 'favicon', 'https://stackoverflow.com', 890, FALSE);

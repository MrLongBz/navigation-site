import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// 数据库表结构 SQL（在Supabase控制台执行）
export const CREATE_TABLES_SQL = `
-- 用户表
create table public.users (
  id bigint primary key generated always as identity,
  username text unique not null,
  password text not null,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 分类表
create table public.categories (
  id bigint primary key generated always as identity,
  name text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 网站表
create table public.websites (
  id bigint primary key generated always as identity,
  name text not null,
  url text not null,
  category text not null,
  description text default '',
  icon_type text default 'favicon',
  icon_value text default '',
  clicks integer default 0,
  is_recommended boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 插入默认数据
insert into public.users (username, password, is_admin) values ('admin', 'admin123', true);

insert into public.categories (name) values 
  ('搜索引擎'),
  ('社交媒体'), 
  ('开发工具'),
  ('设计资源'),
  ('在线工具');

insert into public.websites (name, url, category, description, icon_type, icon_value, is_recommended) values
  ('Google', 'https://www.google.com', '搜索引擎', '全球最大的搜索引擎', 'favicon', 'https://www.google.com', true),
  ('GitHub', 'https://github.com', '开发工具', '代码托管和协作平台', 'favicon', 'https://github.com', true),
  ('Figma', 'https://www.figma.com', '设计资源', '协作设计工具', 'favicon', 'https://www.figma.com', true);
` 
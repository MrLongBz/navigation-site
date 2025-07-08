// 静态数据配置 - 用于Cloudflare Pages部署
import type { Website, Category } from "@/types"

export const staticCategories: Category[] = [
  { 
    id: 1, 
    name: '搜索引擎', 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: 2, 
    name: '社交媒体', 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: 3, 
    name: '开发工具', 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: 4, 
    name: '设计资源', 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: 5, 
    name: '在线工具', 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
];

export const staticWebsites: Website[] = [
  {
    id: 1,
    name: 'Google',
    description: '全球最大的搜索引擎',
    url: 'https://www.google.com',
    category: '搜索引擎',
    icon_type: 'favicon',
    icon_value: 'https://www.google.com/favicon.ico',
    is_recommended: true,
    clicks: 1500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'GitHub',
    description: '代码托管平台',
    url: 'https://github.com',
    category: '开发工具',
    icon_type: 'favicon',
    icon_value: 'https://github.com/favicon.ico',
    is_recommended: true,
    clicks: 1200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Figma',
    description: '在线设计工具',
    url: 'https://www.figma.com',
    category: '设计资源',
    icon_type: 'favicon',
    icon_value: 'https://www.figma.com/favicon.ico',
    is_recommended: true,
    clicks: 800,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'ChatGPT',
    description: 'AI对话助手',
    url: 'https://chat.openai.com',
    category: '在线工具',
    icon_type: 'favicon',
    icon_value: 'https://chat.openai.com/favicon.ico',
    is_recommended: false,
    clicks: 950,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Stack Overflow',
    description: '程序员问答社区',
    url: 'https://stackoverflow.com',
    category: '开发工具',
    icon_type: 'favicon',
    icon_value: 'https://stackoverflow.com/favicon.ico',
    is_recommended: false,
    clicks: 760,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// 静态数据适配器
export class StaticDataAdapter {
  static async getCategories(): Promise<Category[]> {
    return staticCategories;
  }

  static async getWebsites(): Promise<Website[]> {
    return staticWebsites;
  }

  static async getWebsitesByCategory(categoryId: number): Promise<Website[]> {
    const categoryName = staticCategories.find(cat => cat.id === categoryId)?.name;
    if (!categoryName) return [];
    return staticWebsites.filter(site => site.category === categoryName);
  }

  static async getRecommendedWebsites(): Promise<Website[]> {
    return staticWebsites.filter(site => site.is_recommended === true);
  }
}

// 在开发分支中禁用静态模式，使用API
export const isStaticExport = false; 
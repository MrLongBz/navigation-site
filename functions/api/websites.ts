import { D1DatabaseManager } from '../../lib/d1-database'

export const onRequestGet = async (context: any) => {
  try {
    const dbManager = new D1DatabaseManager(context.env.DB)
    
    const websites = await dbManager.getAllWebsites()
    return Response.json(websites)
  } catch (error) {
    console.error('获取网站列表失败:', error)
    return Response.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

export const onRequestPost = async (context: any) => {
  try {
    const data = await context.request.json()
    const {
      name,
      url,
      category,
      description = '',
      iconType = 'favicon',
      iconValue = '',
      isRecommended = false
    } = data

    if (!name || !url || !category) {
      return Response.json(
        { error: '名称、URL和分类不能为空' },
        { status: 400 }
      )
    }

    const dbManager = new D1DatabaseManager(context.env.DB)
    
    const newWebsite = await dbManager.createWebsite({
      name, url, category, description, iconType, iconValue, isRecommended
    })

    return Response.json(newWebsite)
  } catch (error) {
    console.error('添加网站失败:', error)
    return Response.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 
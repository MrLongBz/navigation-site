import { D1DatabaseManager } from '../../lib/d1-database'

export const onRequestGet = async (context: any) => {
  try {
    const dbManager = new D1DatabaseManager(context.env.DB)
    
    const categories = await dbManager.getAllCategories()
    return Response.json(categories)
  } catch (error) {
    console.error('获取分类列表失败:', error)
    return Response.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

export const onRequestPost = async (context: any) => {
  try {
    const { name } = await context.request.json()

    if (!name || !name.trim()) {
      return Response.json(
        { error: '分类名称不能为空' },
        { status: 400 }
      )
    }

    const dbManager = new D1DatabaseManager(context.env.DB)
    
    const newCategory = await dbManager.createCategory(name.trim())
    return Response.json(newCategory)
  } catch (error) {
    console.error('添加分类失败:', error)
    return Response.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 
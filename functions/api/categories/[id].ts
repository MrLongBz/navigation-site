import { D1DatabaseManager } from '../../../lib/d1-database'

export const onRequestPut = async (context: any) => {
  try {
    const id = context.params.id
    const { name } = await context.request.json()

    if (!id || isNaN(Number(id))) {
      return Response.json(
        { error: '无效的分类ID' },
        { status: 400 }
      )
    }

    if (!name || !name.trim()) {
      return Response.json(
        { error: '分类名称不能为空' },
        { status: 400 }
      )
    }

    const dbManager = new D1DatabaseManager(context.env.DB)
    
    const updatedCategory = await dbManager.updateCategory(Number(id), name.trim())
    return Response.json(updatedCategory)
  } catch (error) {
    console.error('更新分类失败:', error)
    return Response.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

export const onRequestDelete = async (context: any) => {
  try {
    const id = context.params.id

    if (!id || isNaN(Number(id))) {
      return Response.json(
        { error: '无效的分类ID' },
        { status: 400 }
      )
    }

    const dbManager = new D1DatabaseManager(context.env.DB)
    
    const success = await dbManager.deleteCategory(Number(id))
    if (success) {
      return Response.json({ success: true })
    } else {
      return Response.json(
        { error: '删除失败' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('删除分类失败:', error)
    return Response.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 
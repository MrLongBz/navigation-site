import { D1DatabaseManager } from '../../../lib/d1-database'

export const onRequestPut = async (context: any) => {
  try {
    const id = context.params.id
    const data = await context.request.json()

    if (!id || isNaN(Number(id))) {
      return Response.json(
        { error: '无效的网站ID' },
        { status: 400 }
      )
    }

    const dbManager = new D1DatabaseManager(context.env.DB)
    
    const updatedWebsite = await dbManager.updateWebsite(Number(id), data)
    return Response.json(updatedWebsite)
  } catch (error) {
    console.error('更新网站失败:', error)
    return Response.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

export const onRequestPatch = async (context: any) => {
  try {
    const id = context.params.id
    const data = await context.request.json()

    if (!id || isNaN(Number(id))) {
      return Response.json(
        { error: '无效的网站ID' },
        { status: 400 }
      )
    }

    const dbManager = new D1DatabaseManager(context.env.DB)
    
    // 处理特殊操作
    if (data.action === 'toggle-recommend') {
      const updatedWebsite = await dbManager.toggleRecommendedStatus(Number(id))
      return Response.json(updatedWebsite)
    } else if (data.action === 'click') {
      const updatedWebsite = await dbManager.incrementClicks(Number(id))
      return Response.json(updatedWebsite)
    } else {
      // 普通更新操作
      const updatedWebsite = await dbManager.updateWebsite(Number(id), data)
      return Response.json(updatedWebsite)
    }
  } catch (error) {
    console.error('更新网站失败:', error)
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
        { error: '无效的网站ID' },
        { status: 400 }
      )
    }

    const dbManager = new D1DatabaseManager(context.env.DB)
    
    const success = await dbManager.deleteWebsite(Number(id))
    if (success) {
      return Response.json({ success: true })
    } else {
      return Response.json(
        { error: '删除失败' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('删除网站失败:', error)
    return Response.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 
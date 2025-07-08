import { D1DatabaseManager } from '../../lib/d1-database'

export const onRequestPost = async (context: any) => {
  try {
    const dbManager = new D1DatabaseManager(context.env.DB)
    
    await dbManager.init()
    
    return Response.json({
      success: true,
      message: '数据库初始化成功'
    })
  } catch (error) {
    console.error('数据库初始化失败:', error)
    return Response.json(
      { error: '数据库初始化失败' },
      { status: 500 }
    )
  }
} 
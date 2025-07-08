import { D1DatabaseManager } from '../../../lib/d1-database'

export const onRequestGet = async (context: any) => {
  try {
    const dbManager = new D1DatabaseManager(context.env.DB)
    
    const recommendedWebsites = await dbManager.getRecommendedWebsites()
    return Response.json(recommendedWebsites)
  } catch (error) {
    console.error('获取推荐网站失败:', error)
    return Response.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import { D1DatabaseManager, type Env } from '@/lib/d1-database'

export const runtime = 'edge'

export async function GET() {
  try {
    const env = process.env as unknown as Env
    const dbManager = new D1DatabaseManager(env.DB)
    
    const recommendedWebsites = await dbManager.getRecommendedWebsites()
    return NextResponse.json(recommendedWebsites)
  } catch (error) {
    console.error('获取推荐网站失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 
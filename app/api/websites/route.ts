import { NextRequest, NextResponse } from 'next/server'
import { D1DatabaseManager, type Env } from '@/lib/d1-database'

export const runtime = 'edge'

export async function GET() {
  try {
    const env = process.env as unknown as Env
    const dbManager = new D1DatabaseManager(env.DB)
    
    const websites = await dbManager.getAllWebsites()
    return NextResponse.json(websites)
  } catch (error) {
    console.error('获取网站列表失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
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
      return NextResponse.json(
        { error: '名称、URL和分类不能为空' },
        { status: 400 }
      )
    }

    const env = process.env as unknown as Env
    const dbManager = new D1DatabaseManager(env.DB)
    
    const newWebsite = await dbManager.createWebsite({
      name, url, category, description, iconType, iconValue, isRecommended
    })

    return NextResponse.json(newWebsite)
  } catch (error) {
    console.error('添加网站失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 
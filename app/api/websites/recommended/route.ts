import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
  try {
    const recommendedWebsites = db.prepare('SELECT * FROM websites WHERE is_recommended = 1 ORDER BY created_at DESC').all()
    return NextResponse.json(recommendedWebsites)
  } catch (error) {
    console.error('获取推荐网站失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 
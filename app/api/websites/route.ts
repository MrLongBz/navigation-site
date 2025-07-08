import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
  try {
    const websites = db.prepare('SELECT * FROM websites ORDER BY created_at DESC').all()
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

    const result = db.prepare(`
      INSERT INTO websites (name, url, category, description, icon_type, icon_value, is_recommended)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, url, category, description, iconType, iconValue, isRecommended ? 1 : 0)

    const newWebsite = db.prepare('SELECT * FROM websites WHERE id = ?').get(result.lastInsertRowid)

    return NextResponse.json(newWebsite)
  } catch (error) {
    console.error('添加网站失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 
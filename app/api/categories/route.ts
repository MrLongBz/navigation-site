import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY created_at ASC').all()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('获取分类列表失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: '分类名称不能为空' },
        { status: 400 }
      )
    }

    const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run(name.trim())
    const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid)

    return NextResponse.json(newCategory)
  } catch (error: any) {
    console.error('添加分类失败:', error)
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: '分类名称已存在' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 
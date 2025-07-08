import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const { name } = await request.json()

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: '分类名称不能为空' },
        { status: 400 }
      )
    }

    db.prepare('UPDATE categories SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(name.trim(), id)
    const updatedCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(id)

    return NextResponse.json(updatedCategory)
  } catch (error: any) {
    console.error('更新分类失败:', error)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    db.prepare('DELETE FROM categories WHERE id = ?').run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除分类失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 
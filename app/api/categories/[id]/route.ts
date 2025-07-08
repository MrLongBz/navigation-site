import { NextRequest, NextResponse } from 'next/server'
import { D1DatabaseManager, type Env } from '@/lib/d1-database'

export const runtime = 'edge'

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

    const env = process.env as unknown as Env
    const dbManager = new D1DatabaseManager(env.DB)
    
    const updatedCategory = await dbManager.updateCategory(id, name.trim())

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
    
    const env = process.env as unknown as Env
    const dbManager = new D1DatabaseManager(env.DB)
    
    const success = await dbManager.deleteCategory(id)

    return NextResponse.json({ success })
  } catch (error) {
    console.error('删除分类失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 
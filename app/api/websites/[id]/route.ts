import { NextRequest, NextResponse } from 'next/server'
import { D1DatabaseManager, type Env } from '@/lib/d1-database'

export const runtime = 'edge'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()

    const env = process.env as unknown as Env
    const dbManager = new D1DatabaseManager(env.DB)
    
    const updatedWebsite = await dbManager.updateWebsite(id, data)

    return NextResponse.json(updatedWebsite)
  } catch (error) {
    console.error('更新网站失败:', error)
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
    
    const success = await dbManager.deleteWebsite(id)

    return NextResponse.json({ success })
  } catch (error) {
    console.error('删除网站失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 
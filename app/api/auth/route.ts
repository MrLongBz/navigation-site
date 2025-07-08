import { NextRequest, NextResponse } from 'next/server'
import { D1DatabaseManager, type Env } from '@/lib/d1-database'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    // 获取D1数据库实例
    const env = process.env as unknown as Env
    const dbManager = new D1DatabaseManager(env.DB)

    // 查找用户
    const user = await dbManager.getUser(username, password)

    if (!user) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    // 返回用户信息（不包含密码）
    const userData = {
      id: user.id,
      username: user.username,
      isAdmin: Boolean(user.is_admin)
    }

    return NextResponse.json({
      success: true,
      user: userData
    })
  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: true })
} 
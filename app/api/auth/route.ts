import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password)

    if (!user) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = user as any
    const userData = {
      id: userInfo.id,
      username: userInfo.username,
      isAdmin: Boolean(userInfo.is_admin)
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
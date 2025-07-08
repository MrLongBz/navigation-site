import { D1DatabaseManager } from '../../lib/d1-database'

export const onRequestPost = async (context: any) => {
  try {
    const { username, password } = await context.request.json()

    if (!username || !password) {
      return Response.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    // 获取D1数据库实例
    const dbManager = new D1DatabaseManager(context.env.DB)

    // 查找用户
    const user = await dbManager.getUser(username, password)

    if (!user) {
      return Response.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    // 返回用户信息（不包含密码）
    const userData = {
      id: (user as any).id,
      username: (user as any).username,
      isAdmin: Boolean((user as any).is_admin)
    }

    return Response.json({
      success: true,
      user: userData
    })
  } catch (error) {
    console.error('登录错误:', error)
    return Response.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

export const onRequestDelete = async (context: any) => {
  return Response.json({ success: true })
} 
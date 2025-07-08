import { type NextRequest, NextResponse } from "next/server"
import { userQueries, initDatabase } from "@/lib/database"

// 初始化数据库
initDatabase()

// GET方法：检查认证状态
export async function GET(request: NextRequest) {
  try {
    // 在真实项目中，这里应该检查会话/JWT token
    // 为了简化，我们返回未认证状态，让前端使用localStorage管理状态
    return NextResponse.json({ error: "未认证" }, { status: 401 })
  } catch (error) {
    console.error("认证检查错误:", error)
    return NextResponse.json({ error: "认证检查失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("收到登录请求...")
    
    const body: { username?: string; password?: string } = await request.json()
    const { username, password } = body
    console.log("请求数据:", { username, password: password ? "***" : "空" })

    if (!username || !password) {
      console.log("用户名或密码为空")
      return NextResponse.json({ error: "用户名和密码不能为空" }, { status: 400 })
    }

    console.log("查询用户:", username)
    const user = userQueries.getByUsername.get(username) as any
    console.log("用户查询结果:", user ? "找到用户" : "用户不存在")

    if (!user || user.password !== password) {
      console.log("登录失败 - 用户名或密码错误")
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 })
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = user
    console.log("登录成功")

    return NextResponse.json({
      success: true,
      user: userInfo,
    })
  } catch (error) {
    console.error("登录错误:", error)
    return NextResponse.json({ error: "登录失败: " + (error instanceof Error ? error.message : String(error)) }, { status: 500 })
  }
}

// DELETE方法：处理登出
export async function DELETE(request: NextRequest) {
  try {
    // 在真实项目中，这里应该清除会话/JWT token
    // 为了简化，我们只返回成功状态
    return NextResponse.json({ success: true, message: "登出成功" })
  } catch (error) {
    console.error("登出错误:", error)
    return NextResponse.json({ error: "登出失败" }, { status: 500 })
  }
}

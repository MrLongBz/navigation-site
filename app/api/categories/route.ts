import { type NextRequest, NextResponse } from "next/server"
import { categoryQueries, initDatabase } from "@/lib/database"

// 初始化数据库
//initDatabase()

export async function GET() {
  try {
    const categories = categoryQueries.getAll.all()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("获取分类列表错误:", error)
    return NextResponse.json({ error: "获取分类列表失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "分类名称不能为空" }, { status: 400 })
    }

    const result = categoryQueries.create.run(name.trim())
    const newCategory = categoryQueries.getById.get(result.lastInsertRowid)

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error("创建分类错误:", error)
    return NextResponse.json({ error: "创建分类失败" }, { status: 500 })
  }
}
